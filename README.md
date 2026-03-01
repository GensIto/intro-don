## memo
https://developer.spotify.com/dashboard

API
```shell
gens@GensMacBook-Air intro-don % curl -X POST "https://accounts.spotify.com/api/token" \
     -H "Content-Type: application/x-www-form-urlencoded" \
     -d "grant_type=client_credentials&client_id=<my-id>&client_secret=<my-secret>"

{"access_token":"<HOGE>","token_type":"Bearer","expires_in":3600}%
gens@GensMacBook-Air intro-don % curl "https://api.spotify.com/v1/tracks/11dFghVXANMlKmJXsNCbNl?market=JP" \
  -H "Authorization: Bearer <HOGE>"
{"album":{"album_type":"single","artists":[{"external_urls":{"spotify":"https://open.spotify.com/artist/6sFIWsNpZYqfjUpaCgueju"},"href":"https://api.spotify.com/v1/artists/6sFIWsNpZYqfjUpaCgueju","id":"6sFIWsNpZYqfjUpaCgueju","name":"Carly Rae Jepsen","type":"artist","uri":"spotify:artist:6sFIWsNpZYqfjUpaCgueju"}],"external_urls":{"spotify":"https://open.spotify.com/album/0tGPJ0bkWOUmH7MEOR77qc"},"href":"https://api.spotify.com/v1/albums/0tGPJ0bkWOUmH7MEOR77qc","id":"0tGPJ0bkWOUmH7MEOR77qc","images":[{"url":"https://i.scdn.co/image/ab67616d0000b2737359994525d219f64872d3b1","width":640,"height":640},{"url":"https://i.scdn.co/image/ab67616d00001e027359994525d219f64872d3b1","width":300,"height":300},{"url":"https://i.scdn.co/image/ab67616d000048517359994525d219f64872d3b1","width":64,"height":64}],"is_playable":true,"name":"Cut To The Feeling","release_date":"2017-05-26","release_date_precision":"day","total_tracks":1,"type":"album","uri":"spotify:album:0tGPJ0bkWOUmH7MEOR77qc"},"artists":[{"external_urls":{"spotify":"https://open.spotify.com/artist/6sFIWsNpZYqfjUpaCgueju"},"href":"https://api.spotify.com/v1/artists/6sFIWsNpZYqfjUpaCgueju","id":"6sFIWsNpZYqfjUpaCgueju","name":"Carly Rae Jepsen","type":"artist","uri":"spotify:artist:6sFIWsNpZYqfjUpaCgueju"}],"disc_number":1,"duration_ms":207959,"explicit":false,"external_ids":{"isrc":"USUM71703861"},"external_urls":{"spotify":"https://open.spotify.com/track/11dFghVXANMlKmJXsNCbNl"},"href":"https://api.spotify.com/v1/tracks/11dFghVXANMlKmJXsNCbNl","id":"7ANmgFJ8YDBh0uUOfSeYrX","is_local":false,"is_playable":true,"name":"Cut To The Feeling","popularity":0,"preview_url":null,"track_number":1,"type":"track","uri":"spotify:track:7ANmgFJ8YDBh0uUOfSeYrX","linked_from":{"external_urls":{"spotify":"https://open.spotify.com/track/11dFghVXANMlKmJXsNCbNl"},"href":"https://api.spotify.com/v1/tracks/11dFghVXANMlKmJXsNCbNl","id":"11dFghVXANMlKmJXsNCbNl","type":"track","uri":"spotify:track:11dFghVXANMlKmJXsNCbNl"}}%
gens@GensMacBook-Air intro-don % 
```

```json
{
	"album": {
		"album_type": "single",
		"artists": [
			{
				"external_urls": {
					"spotify": "https://open.spotify.com/artist/6sFIWsNpZYqfjUpaCgueju"
				},
				"href": "https://api.spotify.com/v1/artists/6sFIWsNpZYqfjUpaCgueju",
				"id": "6sFIWsNpZYqfjUpaCgueju",
				"name": "Carly Rae Jepsen",
				"type": "artist",
				"uri": "spotify:artist:6sFIWsNpZYqfjUpaCgueju"
			}
		],
		"external_urls": {
			"spotify": "https://open.spotify.com/album/0tGPJ0bkWOUmH7MEOR77qc"
		},
		"href": "https://api.spotify.com/v1/albums/0tGPJ0bkWOUmH7MEOR77qc",
		"id": "0tGPJ0bkWOUmH7MEOR77qc",
		"images": [
			{
				"url": "https://i.scdn.co/image/ab67616d0000b2737359994525d219f64872d3b1",
				"width": 640,
				"height": 640
			},
			{
				"url": "https://i.scdn.co/image/ab67616d00001e027359994525d219f64872d3b1",
				"width": 300,
				"height": 300
			},
			{
				"url": "https://i.scdn.co/image/ab67616d000048517359994525d219f64872d3b1",
				"width": 64,
				"height": 64
			}
		],
		"is_playable": true,
		"name": "Cut To The Feeling",
		"release_date": "2017-05-26",
		"release_date_precision": "day",
		"total_tracks": 1,
		"type": "album",
		"uri": "spotify:album:0tGPJ0bkWOUmH7MEOR77qc"
	},
	"artists": [
		{
			"external_urls": {
				"spotify": "https://open.spotify.com/artist/6sFIWsNpZYqfjUpaCgueju"
			},
			"href": "https://api.spotify.com/v1/artists/6sFIWsNpZYqfjUpaCgueju",
			"id": "6sFIWsNpZYqfjUpaCgueju",
			"name": "Carly Rae Jepsen",
			"type": "artist",
			"uri": "spotify:artist:6sFIWsNpZYqfjUpaCgueju"
		}
	],
	"disc_number": 1,
	"duration_ms": 207959,
	"explicit": false,
	"external_ids": {
		"isrc": "USUM71703861"
	},
	"external_urls": {
		"spotify": "https://open.spotify.com/track/11dFghVXANMlKmJXsNCbNl"
	},
	"href": "https://api.spotify.com/v1/tracks/11dFghVXANMlKmJXsNCbNl",
	"id": "7ANmgFJ8YDBh0uUOfSeYrX",
	"is_local": false,
	"is_playable": true,
	"name": "Cut To The Feeling",
	"popularity": 0,
	"preview_url": null,
	"track_number": 1,
	"type": "track",
	"uri": "spotify:track:7ANmgFJ8YDBh0uUOfSeYrX",
	"linked_from": {
		"external_urls": {
			"spotify": "https://open.spotify.com/track/11dFghVXANMlKmJXsNCbNl"
		},
		"href": "https://api.spotify.com/v1/tracks/11dFghVXANMlKmJXsNCbNl",
		"id": "11dFghVXANMlKmJXsNCbNl",
		"type": "track",
		"uri": "spotify:track:11dFghVXANMlKmJXsNCbNl"
	}
}
```