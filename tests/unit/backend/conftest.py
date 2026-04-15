import pytest
from unittest.mock import Mock, patch, MagicMock
import socket
import tempfile
import os
from pathlib import Path


@pytest.fixture
def mock_socket_module():
    with patch('socket.socket') as mock_socket:
        mock_instance = MagicMock()
        mock_socket.return_value = mock_instance
        yield mock_socket, mock_instance


@pytest.fixture
def mock_requests_get():
    with patch('requests.get') as mock_get:
        mock_response = Mock()
        mock_response.status_code = 200
        mock_response.content = b'test content'
        mock_get.return_value = mock_response
        yield mock_get, mock_response


@pytest.fixture
def temp_dir():
    with tempfile.TemporaryDirectory() as tmpdir:
        yield Path(tmpdir)


@pytest.fixture
def sample_ports():
    return [21, 22, 80, 443, 8080]


@pytest.fixture
def sample_wordlist():
    return ['/admin', '/login', '/dashboard', '/api', '/config']


@pytest.fixture
def mock_socket_gaierror():
    with patch('socket.gethostbyname') as mock:
        mock.side_effect = socket.gaierror("Name resolution failed")
        yield mock


@pytest.fixture
def sample_phone_number():
    return '+5511999999999'


@pytest.fixture
def sample_url():
    return 'http://example.com'
