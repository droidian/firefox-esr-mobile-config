# Copyright 2026 Oliver Smith
# SPDX-License-Identifier: MPL-2.0
# Configuration file for the Sphinx documentation builder.
from datetime import datetime
import os
import sys

sys.path.insert(0, os.path.abspath(".."))  # Allow modules to be found

project = "Mobile Config Firefox"
copyright = f"{datetime.now().year} mobile-config-firefox contributors"
extensions = [
    "myst_parser",
    "sphinx.ext.autodoc",
    "sphinx.ext.autosummary",
    "sphinx.ext.doctest",
    "sphinxcontrib.autoprogram",
    "sphinxcontrib.jquery",
]
exclude_patterns = ["_build", "_out", "Thumbs.db", ".DS_Store", ".venv", "README.md"]

html_theme = "pmos"
html_theme_options = {
    "source_edit_link": "https://gitlab.postmarketos.org/postmarketOS/mobile-config-firefox/-/blob/main/docs/{filename}",
    "logo": "_static/logo.png",
}
html_static_path = ["_static"]
