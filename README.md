# Object Metadata Autocomplete

A Roam Research extension that lets you search for real-world objects (books, places, and more) and create structured pages with their metadata.

## Features

### Book Autocomplete
Search [OpenLibrary](https://openlibrary.org) for books and create rich pages with metadata:
- Cover image, author(s), publish year, rating, page count, subjects
- Author pages are auto-created with `isa::[[person]] [[author]]`
- Book link is copied to clipboard and the page opens in the sidebar

### Google Maps Autocomplete
Search Google Places for locations and create pages with:
- Address, coordinates, Google Maps URL, website, vicinity
- Location type tags (e.g. `[[restaurant]]`, `[[park]]`)

## Usage

Open the Roam command palette (`Cmd+P`) and run:
- **Book autocomplete** — search and insert books
- **Google maps autocomplete** — search and insert locations

## Setup

### Google Maps API Key (required for location search)

1. Go to [Google Cloud Console](https://console.cloud.google.com/apis/credentials)
2. Create a project (or select an existing one)
3. Enable the **Places API** under APIs & Services > Library
4. Create an API key under APIs & Services > Credentials
5. (Recommended) Restrict the key to HTTP referrers matching `https://roamresearch.com/*`
6. (Recommended) Set a daily quota limit under APIs & Services > Quotas to stay within the free tier
7. Paste the key in Roam: Settings > Extensions > Object Metadata Autocomplete > Google Maps API Key

Book search uses OpenLibrary's public API and requires no configuration.
