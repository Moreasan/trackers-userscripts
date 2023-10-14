Find Unique Titles is a user script that allow finding content to upload from other trackers.

# Install
You copy paste the content of the file `dist/find.unique.titles.user.js`.
You can generate it by running run `npm run dev`. 

# Changelog
## 
- Add support for TiK
- Refactor code to use generator for creating search requests. It is essentially practical when you need to do some fetching to build the request (like fetching another page for IMDB id).

## 2023-10-08

- Add support for CHD and HDSky (thanks to @gawain12)

## 2023-09-30

- Add support for BHD page
- Fix an issue where TV content is shown as new content in PTP
- Add support for GPW