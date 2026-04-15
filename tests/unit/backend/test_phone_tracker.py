import pytest
from unittest.mock import patch, Mock, MagicMock
import sys
import os
import re

sys.path.insert(0, os.path.join(os.path.dirname(__file__), '..', '..', '..', 'Hex Stalcke', 'tools'))


class TestPhoneTracker:

    @pytest.fixture(autouse=True)
    def setup(self):
        from phone_tracker import PhoneTracker, main as phone_main
        self.PhoneTracker = PhoneTracker
        self.main = phone_main

    def test_phone_validation_brazil_format(self):
        tracker = self.PhoneTracker()

        valid_phones = [
            '+5511999999999',
            '5511999999999',
            '(11) 99999-9999',
            '11 999999999',
            '+55 11 99999-9999'
        ]

        for phone in valid_phones:
            assert tracker.validate_phone(phone), f"Should validate: {phone}"

    def test_phone_validation_international_format(self):
        tracker = self.PhoneTracker()

        valid_phones = [
            '+14155552671',
            '+442071234567',
            '+33123456789'
        ]

        for phone in valid_phones:
            assert tracker.validate_phone(phone), f"Should validate: {phone}"

    def test_phone_validation_invalid(self):
        tracker = self.PhoneTracker()

        invalid_phones = [
            '123',
            'abc',
            '',
            '99999999999999999999'
        ]

        for phone in invalid_phones:
            assert not tracker.validate_phone(phone), f"Should reject: {phone}"

    def test_phone_strip_formatting(self):
        tracker = self.PhoneTracker()

        formatted = '(11) 99999-9999'
        stripped = tracker.strip_formatting(formatted)

        assert stripped == '11999999999'
        assert '(' not in stripped
        assert ')' not in stripped
        assert '-' not in stripped
        assert ' ' not in stripped

    def test_phone_extract_country_code(self):
        tracker = self.PhoneTracker()

        test_cases = [
            ('+5511999999999', '55'),
            ('+14155552671', '1'),
            ('1199999999', '55')
        ]

        for phone, expected_code in test_cases:
            country_code = tracker.extract_country_code(phone)
            assert country_code == expected_code

    def test_phone_extract_area_code_brazil(self):
        tracker = self.PhoneTracker()

        result = tracker.extract_area_code('+5511999999999')
        assert result == '11'

    def test_tracker_initialization(self):
        tracker = self.PhoneTracker()

        assert hasattr(tracker, 'base_url')
        assert hasattr(tracker, 'timeout')

    def test_tracker_api_request_format(self):
        tracker = self.PhoneTracker()

        with patch('requests.get') as mock_get:
            mock_response = Mock()
            mock_response.status_code = 200
            mock_response.json.return_value = {'location': 'São Paulo'}
            mock_get.return_value = mock_response

            result = tracker.lookup('+5511999999999')

            mock_get.assert_called_once()
            call_args = mock_get.call_args
            assert 'params' in call_args.kwargs or len(call_args.args) > 0

    def test_tracker_handles_api_error(self):
        tracker = self.PhoneTracker()

        with patch('requests.get') as mock_get:
            mock_get.side_effect = Exception("API Error")

            result = tracker.lookup('+5511999999999')

            assert result is None

    def test_tracker_handles_invalid_response(self):
        tracker = self.PhoneTracker()

        with patch('requests.get') as mock_get:
            mock_response = Mock()
            mock_response.status_code = 404
            mock_get.return_value = mock_response

            result = tracker.lookup('+5511999999999')

            assert result is None or 'error' in str(result).lower()

    def test_main_with_valid_phone(self, capsys):
        with patch('sys.argv', ['phone_tracker', '+5511999999999']):
            with patch.object(self.PhoneTracker, 'lookup') as mock_lookup:
                mock_lookup.return_value = {'location': 'São Paulo'}

                self.main()

    def test_main_with_invalid_phone(self, capsys):
        with patch('sys.argv', ['phone_tracker', 'invalid']):
            self.main()

    def test_phone_number_too_short(self):
        tracker = self.PhoneTracker()

        short_phones = ['123', '12345', '+1']
        for phone in short_phones:
            assert not tracker.validate_phone(phone)

    def test_phone_number_too_long(self):
        tracker = self.PhoneTracker()

        long_phone = '1' * 20
        assert not tracker.validate_phone(long_phone)

    def test_extraction_preserves_digits(self):
        tracker = self.PhoneTracker()

        mixed = '+55 (11) 99999-9999'
        digits = tracker.strip_formatting(mixed)

        assert digits.isdigit()
        assert len(digits) >= 10
