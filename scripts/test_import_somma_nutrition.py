import importlib.util
import unittest
from pathlib import Path

spec = importlib.util.spec_from_file_location('importer', Path(__file__).with_name('import-somma-nutrition.py'))
importer = importlib.util.module_from_spec(spec)
spec.loader.exec_module(importer)

class ImportTests(unittest.TestCase):
    def test_missing_markers_never_become_zero(self):
        for value, status in [(None,'notAnalyzed'),(' ','notAnalyzed'),('Tr','trace'),
                              ('NA','notApplicable'),('*','underReview'),(',0,02','invalidSourceValue'),
                              (-0.026,'invalidSourceValue'),(float('nan'),'invalidSourceValue')]:
            self.assertEqual(importer.parse_value(value),(None,status))
        self.assertEqual(importer.parse_value(0),(0,None))
        self.assertEqual(importer.parse_value(1.2345),(1.2345,None))

    def test_aliases_keep_preparation_and_no_identity_merging(self):
        self.assertIn('Aipim cozida',importer.aliases_for('Mandioca, cozida','Mandioca cozida'))
        self.assertNotIn('Aipim crua',importer.aliases_for('Mandioca, cozida','Mandioca cozida'))
        self.assertNotEqual(importer.display_name('Arroz, integral, cru'),
                            importer.display_name('Arroz, integral, cozido'))

    def test_checksum_rejects_changed_source_before_parsing(self):
        from unittest.mock import patch
        with patch.object(Path,'read_bytes',return_value=b'not the pinned workbook'):
            with self.assertRaisesRegex(ValueError,'checksum'):
                importer.build()

if __name__=='__main__': unittest.main()
