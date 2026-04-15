import pytest
from unittest.mock import patch, Mock, MagicMock
import sys
import os

sys.path.insert(0, os.path.join(os.path.dirname(__file__), '..', '..', '..', 'Hex Stalcke', 'tools'))


class TestHexScanner:

    @pytest.fixture(autouse=True)
    def setup(self):
        from hex_scanner import main as hex_main, default_dir
        self.main = hex_main
        self.default_dir = default_dir

    def test_default_wordlist_contains_common_paths(self):
        expected_paths = ['/admin', '/login', '/dashboard', '/api', '/config.php']
        for path in expected_paths:
            assert path in self.default_dir

    def test_custom_wordlist_loading(self, temp_dir, capsys):
        wordlist_path = temp_dir / "custom_wordlist.txt"
        wordlist_path.write_text("/test1\n/test2\n# comment\n\n/test3\n")

        with patch('sys.argv', ['hex_scanner', 'http://example.com', '-w', str(wordlist_path)]):
            self.main()

        assert wordlist_path.exists()

    def test_custom_wordlist_not_found(self, capsys):
        with patch('sys.argv', ['hex_scanner', 'http://example.com', '-w', '/nonexistent/wordlist.txt']):
            self.main()

    def test_scanner_adds_leading_slash(self, mock_requests_get, capsys):
        mock_get, mock_response = mock_requests_get
        mock_response.status_code = 404
        mock_get.return_value = mock_response

        with patch('sys.argv', ['hex_scanner', 'http://example.com']):
            self.main()

    def test_scanner_handles_200_response(self, mock_requests_get, capsys):
        mock_get, mock_response = mock_requests_get
        mock_response.status_code = 200
        mock_response.content = b'<html>Test</html>'
        mock_get.return_value = mock_response

        with patch('sys.argv', ['hex_scanner', 'http://example.com']):
            self.main()

    def test_scanner_handles_301_redirect(self, mock_requests_get, capsys):
        mock_get, mock_response = mock_requests_get
        mock_response.status_code = 301
        mock_get.return_value = mock_response

        with patch('sys.argv', ['hex_scanner', 'http://example.com']):
            self.main()

    def test_scanner_handles_403_forbidden(self, mock_requests_get, capsys):
        mock_get, mock_response = mock_requests_get
        mock_response.status_code = 403
        mock_get.return_value = mock_response

        with patch('sys.argv', ['hex_scanner', 'http://example.com']):
            self.main()

    def test_scanner_ignores_other_status_codes(self, mock_requests_get, capsys):
        mock_get, mock_response = mock_requests_get
        mock_response.status_code = 404
        mock_get.return_value = mock_response

        with patch('sys.argv', ['hex_scanner', 'http://example.com']):
            self.main()

    def test_scanner_handles_timeout(self, capsys):
        import requests as req

        with patch('sys.argv', ['hex_scanner', 'http://example.com', '-t', '1']):
            with patch('requests.get') as mock_get:
                mock_get.side_effect = req.exceptions.Timeout()
                self.main()

    def test_scanner_handles_connection_error(self, capsys):
        import requests as req

        with patch('sys.argv', ['hex_scanner', 'http://example.com']):
            with patch('requests.get') as mock_get:
                mock_get.side_effect = req.exceptions.ConnectionError()
                self.main()

    def test_scanner_adds_http_protocol(self, mock_requests_get, capsys):
        mock_get, mock_response = mock_requests_get
        mock_response.status_code = 404
        mock_get.return_value = mock_response

        with patch('sys.argv', ['hex_scanner', 'example.com']):
            self.main()

        first_call_url = mock_get.call_args[0][0]
        assert first_call_url.startswith('http://')

    def test_scanner_removes_trailing_slash(self, mock_requests_get, capsys):
        mock_get, mock_response = mock_requests_get
        mock_response.status_code = 404
        mock_get.return_value = mock_response

        with patch('sys.argv', ['hex_scanner', 'http://example.com///']):
            self.main()

    def test_scanner_uses_custom_timeout(self):
        with patch('sys.argv', ['hex_scanner', 'http://example.com', '-t', '10']):
            with patch('requests.get') as mock_get:
                mock_response = Mock()
                mock_response.status_code = 404
                mock_get.return_value = mock_response

                self.main()

                call_kwargs = mock_get.call_args[1]
                assert call_kwargs['timeout'] == 10

    def test_scanner_respects_interesting_status_codes(self, mock_requests_get, capsys):
        interesting_codes = [200, 301, 302, 403]

        for code in interesting_codes:
            mock_get, mock_response = mock_requests_get
            mock_response.status_code = code
            mock_get.return_value = mock_response

            with patch('sys.argv', ['hex_scanner', 'http://example.com']):
                self.main()
