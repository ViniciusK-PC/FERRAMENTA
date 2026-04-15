"""Testes para Hex Stalcke/hexstalcke_mcp.py

Cobre:
- Paleta de cores HexStalckeColors (contratos de constantes)
- Import smoke da camada MCP
- Inicialização do HexStalckeClient sem servidor (deve degradar graciosamente)
"""
import pytest
import sys
import os

sys.path.insert(
    0, os.path.join(os.path.dirname(__file__), '..', '..', '..', 'Hex Stalcke')
)


@pytest.fixture(scope='module')
def mcp_module():
    return pytest.importorskip('hexstalcke_mcp')


class TestHexStalckeColors:
    def test_basic_ansi_colors_defined(self, mcp_module):
        colors = mcp_module.HexStalckeColors
        for attr in ('RED', 'GREEN', 'YELLOW', 'BLUE', 'MAGENTA', 'CYAN', 'WHITE'):
            assert hasattr(colors, attr)
            assert getattr(colors, attr).startswith('\033[')

    def test_enhanced_palette_defined(self, mcp_module):
        colors = mcp_module.HexStalckeColors
        for attr in ('MATRIX_GREEN', 'NEON_BLUE', 'HACKER_RED', 'RESET', 'BOLD'):
            assert hasattr(colors, attr)

    def test_severity_colors_defined(self, mcp_module):
        colors = mcp_module.HexStalckeColors
        for attr in ('VULN_CRITICAL', 'VULN_HIGH', 'VULN_MEDIUM', 'VULN_LOW', 'VULN_INFO'):
            assert hasattr(colors, attr)

    def test_status_colors_defined(self, mcp_module):
        colors = mcp_module.HexStalckeColors
        for attr in ('SUCCESS', 'WARNING', 'ERROR', 'CRITICAL', 'INFO', 'DEBUG'):
            assert hasattr(colors, attr)

    def test_reset_terminates_sequence(self, mcp_module):
        assert mcp_module.HexStalckeColors.RESET == '\033[0m'

    def test_backward_compat_alias(self, mcp_module):
        assert mcp_module.Colors is mcp_module.HexStalckeColors


class TestModuleStructure:
    def test_client_class_exported(self, mcp_module):
        assert hasattr(mcp_module, 'HexStalckeClient')

    def test_setup_mcp_server_exported(self, mcp_module):
        assert callable(getattr(mcp_module, 'setup_mcp_server', None))

    def test_main_entrypoint_exported(self, mcp_module):
        assert callable(getattr(mcp_module, 'main', None))

    def test_colored_formatter_exported(self, mcp_module):
        assert hasattr(mcp_module, 'ColoredFormatter')


class TestHexStalckeClient:
    def test_init_sem_servidor_nao_levanta(self, mcp_module):
        # Cliente deve degradar graciosamente quando servidor está offline
        client = mcp_module.HexStalckeClient('http://127.0.0.1:1', timeout=1)
        assert client.server_url == 'http://127.0.0.1:1'
        assert client.timeout == 1

    def test_server_url_sem_barra_final(self, mcp_module):
        client = mcp_module.HexStalckeClient('http://127.0.0.1:1/', timeout=1)
        assert not client.server_url.endswith('/')

    def test_safe_get_retorna_erro_quando_offline(self, mcp_module):
        client = mcp_module.HexStalckeClient('http://127.0.0.1:1', timeout=1)
        resp = client.safe_get('health')
        assert resp.get('success') is False
        assert 'error' in resp
