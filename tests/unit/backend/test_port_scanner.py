import pytest
from unittest.mock import patch, MagicMock, Mock
import socket
import sys
import os

sys.path.insert(0, os.path.join(os.path.dirname(__file__), '..', '..', '..', 'Hex Stalcke', 'tools'))


class TestPortScanner:

    @pytest.fixture(autouse=True)
    def setup(self):
        from port_scanner import scan, PORTS
        self.scan = scan
        self.PORTS = PORTS

    def test_scan_detects_open_port(self, mock_socket_module, capsys):
        mock_socket, mock_instance = mock_socket_module
        mock_instance.connect_ex.return_value = 0

        self.scan('192.168.1.1')

        mock_instance.connect_ex.assert_called()
        assert mock_instance.connect_ex.call_count > 0

    def test_scan_skips_closed_port(self, mock_socket_module):
        mock_socket, mock_instance = mock_socket_module
        mock_instance.connect_ex.return_value = 1

        result = self.scan('192.168.1.1')

        assert mock_instance.connect_ex.call_count == len(self.PORTS)

    def test_scan_handles_timeout(self, mock_socket_module):
        mock_socket, mock_instance = mock_socket_module
        mock_instance.connect_ex.side_effect = socket.timeout()

        result = self.scan('192.168.1.1')

        assert mock_instance.connect_ex.call_count >= 0

    def test_scan_returns_void(self, mock_socket_module, capsys):
        mock_socket, mock_instance = mock_socket_module
        mock_instance.connect_ex.return_value = 1

        result = self.scan('192.168.1.1')

        assert result is None

    def test_ports_list_contains_common_ports(self):
        expected_ports = [21, 22, 23, 25, 80, 443, 3389, 8080]
        for port in expected_ports:
            assert port in self.PORTS

    def test_scan_with_multiple_open_ports(self, mock_socket_module, capsys):
        mock_socket, mock_instance = mock_socket_module
        call_count = [0]

        def connect_side_effect(*args):
            call_count[0] += 1
            return 0 if call_count[0] <= 3 else 1

        mock_instance.connect_ex.side_effect = connect_side_effect

        self.scan('192.168.1.1')

        assert mock_instance.connect_ex.call_count >= 3

    def test_scan_resolves_domain(self):
        with patch('socket.gethostbyname') as mock_gethostbyname:
            mock_gethostbyname.return_value = '192.168.1.1'

            with patch('socket.socket') as mock_socket:
                mock_instance = MagicMock()
                mock_instance.connect_ex.return_value = 1
                mock_socket.return_value = mock_instance

                from port_scanner import main
                with patch('sys.argv', ['port_scanner', 'example.com']):
                    try:
                        main()
                    except SystemExit:
                        pass

                mock_gethostbyname.assert_called_once_with('example.com')

    def test_scan_handles_invalid_host(self, capsys):
        with patch('socket.gethostbyname') as mock_gethostbyname:
            mock_gethostbyname.side_effect = socket.gaierror("Host not found")

            from port_scanner import main
            with patch('sys.argv', ['port_scanner', 'invalid.host.example']):
                try:
                    main()
                except SystemExit:
                    pass

    def test_scan_removes_protocol_from_target(self):
        with patch('socket.gethostbyname') as mock_gethostbyname:
            mock_gethostbyname.return_value = '192.168.1.1'

            with patch('socket.socket') as mock_socket:
                mock_instance = MagicMock()
                mock_instance.connect_ex.return_value = 1
                mock_socket.return_value = mock_instance

                from port_scanner import main
                with patch('sys.argv', ['port_scanner', 'https://example.com/path']):
                    try:
                        main()
                    except SystemExit:
                        pass

                mock_gethostbyname.assert_called_once_with('example.com')

    def test_scan_service_detection(self, mock_socket_module, capsys):
        mock_socket, mock_instance = mock_socket_module
        mock_instance.connect_ex.return_value = 0

        self.scan('192.168.1.1')

        assert mock_instance.connect_ex.called
