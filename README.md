# Xquality

Lets Create XQuality Watch Videos, make it main Colors Red and Black, Ill add Advertise banner as placeholders for now, Add Scroll Pinning For Thumbnails make it the tn and just the title.  use: List files
List all files

GET
https://doodapi.co/api/file/list?key={your_api_key}
Parameter
Description
Required
key
Your API Key
Yes
page
Pagination
no
per_page
Max videos per page (Max 200)
no
fld_id
Videos inside a folder
no
created
Show files uploaded after timestamp (Ex : 2021-10-07 03:15:19)
Or specify number to show only files uploaded X minutes ago
no
Response
{
  "msg": "OK",
  "server_time": "2017-08-11 04:30:07",
  "status": 200,
  "result": {
    "total_pages": 1,
    "files": [
      {
        "download_url": "https://dood.to/d/xxx",
        "single_img": "https://img.doodcdn.io/snaps/xxx.jpg",
        "file_code": "xxx",
        "canplay": 1,
        "length": "1234",
        "views": "1",
        "uploaded": "2017-08-11 04:30:07",
        "public": "1",
        "fld_id": "0",
        "title": "test_file"
      }
    ],
    "results_total": "1",
    "results": 1
  }
}
use my api key:569006adyjfixyfl408h1p. and only get the videos from the folder "Ace of Spades"

This project was built with [Lovable](https://lovable.dev).

**Live app**: https://xquality.lovable.app

## Build with Lovable

Continue developing this project in the [Lovable editor](https://lovable.dev/projects/c7ae1ee7-0bdb-4748-87ed-557687d8845c).

- **Ship faster**: describe what you want to build and Lovable handles the code.
- **Stay in sync**: every change made in Lovable is committed straight to this repository.
- **Full ownership**: this code is yours. Push to `main` on GitHub and your changes sync back into Lovable, ready for your next prompt.

## Development

Prefer working locally? You need Node.js and npm — [install with nvm](https://github.com/nvm-sh/nvm#installing-and-updating).

```sh
git clone <this-repository-url>
cd <repository-name>
npm i
npm run dev
```
