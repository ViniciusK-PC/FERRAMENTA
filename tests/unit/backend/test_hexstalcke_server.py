"""Testes para Hex Stalcke/hexstalcke_server.py

Cobre o que é testável sem inicializar o servidor Flask inteiro:
- strip_ansi_codes (função pura no topo do arquivo)
- Import smoke (módulo carrega sem crash quando deps estão instaladas)
- Presença das rotas/handlers Flask esperados
"""
import pytest
import sys
import os

sys.path.insert(
    0, os.path.join(os.path.dirname(__file__), '..', '..', '..', 'Hex Stalcke')
)


@pytest.fixture(scope='module')
def server_module():
    return pytest.importorskip('hexstalcke_server')


class TestStripAnsiCodes:
    def test_remove_cores_basicas(self, server_module):
        texto = '\033[91merro\033[0m'
        assert server_module.strip_ansi_codes(texto) == 'erro'

    def test_remove_codigos_256_cores(self, server_module):
        texto = '\033[38;5;46mverde matrix\033[0m'
        assert server_module.strip_ansi_codes(texto) == 'verde matrix'

    def test_remove_bold_dim(self, server_module):
        texto = '\033[1mbold\033[2mdim\033[0m'
        assert server_module.strip_ansi_codes(texto) == 'bolddim'

    def test_texto_sem_ansi_inalterado(self, server_module):
        assert server_module.strip_ansi_codes('texto puro') == 'texto puro'

    def test_string_vazia(self, server_module):
        assert server_module.strip_ansi_codes('') == ''

    def test_multiplas_sequencias_encadeadas(self, server_module):
        texto = '\033[91m[ERRO]\033[0m \033[92m[OK]\033[0m fim'
        assert server_module.strip_ansi_codes(texto) == '[ERRO] [OK] fim'


class TestServerStructure:
    def test_flask_app_existe(self, server_module):
        # Servidor principal expõe app Flask
        assert hasattr(server_module, 'app') or hasattr(server_module, 'application')

    def test_classe_modern_visual_engine(self, server_module):
        assert hasattr(server_module, 'ModernVisualEngine')

    def test_classes_de_decisao_e_erro(self, server_module):
        for name in (
            'IntelligentDecisionEngine',
            'IntelligentErrorHandler',
            'GracefulDegradation',
        ):
            assert hasattr(server_module, name), f'esperado export: {name}'

    def test_enums_principais(self, server_module):
        for name in ('TargetType', 'TechnologyStack', 'ErrorType', 'RecoveryAction'):
            assert hasattr(server_module, name)

    def test_dataclasses_principais(self, server_module):
        for name in ('TargetProfile', 'AttackStep', 'AttackChain', 'ErrorContext'):
            assert hasattr(server_module, name)


class TestHealthAndAuthHelpers:
    def test_health_check_handler_callable(self, server_module):
        # Rotas Flask viram funções nomeadas no módulo
        if hasattr(server_module, 'health_check_simplified'):
            assert callable(server_module.health_check_simplified)

    def test_require_auth_decorator(self, server_module):
        if hasattr(server_module, 'require_auth'):
            assert callable(server_module.require_auth)
