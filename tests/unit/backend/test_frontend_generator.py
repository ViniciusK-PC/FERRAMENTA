import pytest
from unittest.mock import patch, Mock, MagicMock
import sys
import os
import tempfile
from pathlib import Path

sys.path.insert(0, os.path.join(os.path.dirname(__file__), '..', '..', '..', 'Hex Stalcke', 'tools'))


class TestFrontendGenerator:

    @pytest.fixture(autouse=True)
    def setup(self):
        from frontend_generator import WebsiteCloner, main as cloner_main
        self.WebsiteCloner = WebsiteCloner
        self.main = cloner_main

    def test_cloner_initialization(self):
        cloner = self.WebsiteCloner()

        assert hasattr(cloner, 'headers')
        assert 'User-Agent' in cloner.headers

    def test_cloner_validates_url_format(self):
        cloner = self.WebsiteCloner()

        valid_urls = [
            'https://example.com',
            'http://example.com',
            'https://example.com/path/to/page',
            'https://subdomain.example.com'
        ]

        for url in valid_urls:
            assert cloner.validate_url(url), f"Should validate: {url}"

    def test_cloner_rejects_invalid_urls(self):
        cloner = self.WebsiteCloner()

        invalid_urls = [
            'not-a-url',
            'ftp://example.com',
            '',
            'example.com'
        ]

        for url in invalid_urls:
            assert not cloner.validate_url(url), f"Should reject: {url}"

    def test_clone_fetches_html(self, temp_dir):
        cloner = self.WebsiteCloner()

        with patch('requests.get') as mock_get:
            mock_response = Mock()
            mock_response.status_code = 200
            mock_response.text = '<html><body>Test</body></html>'
            mock_response.headers = {'content-type': 'text/html'}
            mock_get.return_value = mock_response

            result = cloner.clone('https://example.com', str(temp_dir))

            assert result is not None

    def test_clone_handles_404_response(self, temp_dir):
        cloner = self.WebsiteCloner()

        with patch('requests.get') as mock_get:
            mock_response = Mock()
            mock_response.status_code = 404
            mock_get.return_value = mock_response

            result = cloner.clone('https://example.com/notfound', str(temp_dir))

            assert result is False

    def test_clone_creates_output_directory(self, temp_dir):
        cloner = self.WebsiteCloner()
        output_dir = temp_dir / 'output'

        with patch('requests.get') as mock_get:
            mock_response = Mock()
            mock_response.status_code = 200
            mock_response.text = '<html>Test</html>'
            mock_get.return_value = mock_response

            cloner.clone('https://example.com', str(output_dir))

            assert output_dir.exists()

    def test_clone_saves_index_html(self, temp_dir):
        cloner = self.WebsiteCloner()

        with patch('requests.get') as mock_get:
            mock_response = Mock()
            mock_response.status_code = 200
            mock_response.text = '<html><body>Test Content</body></html>'
            mock_get.return_value = mock_response

            cloner.clone('https://example.com', str(temp_dir))

            index_file = temp_dir / 'index.html'
            assert index_file.exists()

    def test_clone_handles_connection_error(self, temp_dir):
        cloner = self.WebsiteCloner()

        with patch('requests.get') as mock_get:
            import requests
            mock_get.side_effect = requests.exceptions.ConnectionError()

            result = cloner.clone('https://example.com', str(temp_dir))

            assert result is False

    def test_clone_handles_timeout(self, temp_dir):
        cloner = self.WebsiteCloner()

        with patch('requests.get') as mock_get:
            import requests
            mock_get.side_effect = requests.exceptions.Timeout()

            result = cloner.clone('https://example.com', str(temp_dir))

            assert result is False

    def test_clone_respects_custom_timeout(self, temp_dir):
        cloner = self.WebsiteCloner(timeout=30)

        with patch('requests.get') as mock_get:
            mock_response = Mock()
            mock_response.status_code = 200
            mock_response.text = '<html>Test</html>'
            mock_get.return_value = mock_response

            cloner.clone('https://example.com', str(temp_dir))

            call_kwargs = mock_get.call_args.kwargs
            assert call_kwargs.get('timeout') == 30

    def test_main_with_valid_url(self, temp_dir, capsys):
        with patch('sys.argv', ['frontend_generator', 'https://example.com', '-o', str(temp_dir)]):
            with patch.object(self.WebsiteCloner, 'clone') as mock_clone:
                mock_clone.return_value = True
                self.main()

    def test_main_with_invalid_url(self, capsys):
        with patch('sys.argv', ['frontend_generator', 'invalid-url']):
            self.main()

    def test_clone_extracts_assets(self, temp_dir):
        cloner = self.WebsiteCloner()

        with patch('requests.get') as mock_get:
            mock_response = Mock()
            mock_response.status_code = 200
            mock_response.text = '''
                <html>
                    <script src="/assets/app.js"></script>
                    <link href="/assets/style.css" rel="stylesheet">
                    <img src="/images/logo.png">
                </html>
            '''
            mock_get.return_value = mock_response

            result = cloner.extract_assets(mock_response.text, 'https://example.com')

            assert isinstance(result, list)

    def test_clone_handles_ssl_error(self, temp_dir):
        cloner = self.WebsiteCloner()

        with patch('requests.get') as mock_get:
            import requests
            mock_get.side_effect = requests.exceptions.SSLError()

            result = cloner.clone('https://example.com', str(temp_dir))

            assert result is False
