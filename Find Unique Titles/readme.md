Find Unique Titles is a user script that allow finding content to upload from other trackers.

# Install
You copy paste the content of the file `dist/find.unique.titles.user.js`.
You can generate it by running run `npm run dev`.

# Changelog
## 2023-12
- Add support for MTV
- Add support for using title and year when IMDB ID is not available when checking titles on PTP.
- The script now highlight the reason why a title can be uploaded
## 2023-11
- Some work is done to use IMDB Scout code for searching
- Add support for TSeeds

## 2023-10
- Add support for TiK
- Add support for Pter
- Fix HDB not working as a source
- Refactor code to use generator for creating search requests. It is essentially practical when you need to do some fetching to build the request (like fetching another page for IMDB id).
- Add support for CHD and HDSky (thanks to @gawain12)
- PTP can be used a source
- Add a settings panel to configure the script (breaking change)

## 2023-09-30

- Add support for BHD page
- Fix an issue where TV content is shown as new content in PTP
- Add support for GPW
