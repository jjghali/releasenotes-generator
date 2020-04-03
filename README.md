#Documentation
https://confluence.atlassian.com/doc/macros-139387.html
https://confluence.atlassian.com/doc/confluence-wiki-markup-251003035.html#ConfluenceWikiMarkup-Macros
https://confluence.atlassian.com/doc/jira-issues-macro-139380.html
https://developer.atlassian.com/server/confluence/confluence-server-rest-api/
https://developer.atlassian.com/server/confluence/confluence-rest-api-examples/
https://www.npmjs.com/package/easy-md-to-html
https://www.npmjs.com/package/@kenchan0130/markdown-to-atlassian-wiki-markup
https://confluence.atlassian.com/doc/expand-macro-223222352.html

### get page confluence

```
curl --request GET \
  --url 'https://confluence.desjardins.com/rest/api/content?spaceKey=~DWP1473&title=test2&expand=body.storage.value,version' \
  --header 'authorization: Basic token' \
  --cookie JSESSIONID=59EF78C6E33A70424CCD4ED247B2F157
```

### create page confluence with wiki markup

```
curl --request POST \
  --url https://confluence.desjardins.com/rest/api/content \
  --header 'authorization: Basic ' \
  --header 'content-type: application/json' \
  --cookie JSESSIONID=59EF78C6E33A70424CCD4ED247B2F157 \
  --data '{
"type":"page",
	"title":"test2",
	"space":{"key":"~DWP1473"},
	"body":{"storage":{"value":"||Some Example||More Example|| ","representation":"wiki"}}
}
'
```

### update page confluence with wiki markup

incvrement version number by 1 after each modification

```
curl --request PUT \
  --url https://confluence.desjardins.com/rest/api/content/964835210 \
  --header 'authorization: Basic ' \
  --header 'content-type: application/json' \
  --cookie JSESSIONID=59EF78C6E33A70424CCD4ED247B2F157 \
  --data '{
	"id":"964835210",
"type":"page",
	"title":"test32",
	"space":{"key":"~DWP1473"},
	"body":{"storage":{"value":"||Some Example||Morsdsdsdse Example|| ","representation":"wiki"}},
	"version":{"number":2}
}
'
```

### insert jira issue table with JQL query

`

curl --request PUT \
 --url https://confluence.desjardins.com/rest/api/content/964835210 \
 --header 'authorization: Basic ' \
 --header 'content-type: application/json' \
 --cookie JSESSIONID=59EF78C6E33A70424CCD4ED247B2F157 \
 --data '{
"id":"964835210",
"type":"page",
"title":"test32",
"space":{"key":"~DWP1473"},
"body":{"storage":{"value":"{expand:This is my message}{jiraissues:anonymous=false | jqlQuery=project = PH}{expand} ","representation":"wiki"}}, "version":{"number":8}
}
'
`
