# stackwatch

Watch StackExchange sites and open a browser window when something of interest has happened.

Currently, it looks for new questions tagged `node.js`. Command-line option for specifying a different tag should be easy enough to implement. I just, uh, haven't yet. Feel free to open a pull request...

Installation
------------

```bash
npm install -g stackwatch
```

Usage
-----

```
stackwatch [options]

Options:
  --tag          Tag to search on [default: node.js]
  --wait         Seconds to wait between checks [default: 60]
  --version, -v  Show version
  --help, -h     Show this message
```

Running `stackwatch` with no options will check StackOverflow every 60 seconds to see if there is a new question that is tagged `node.js`. If it finds one or more, these questions will automatically open in your browser.

Use the `tag` option to specify a different tag to watch. 

Use the `wait` value to check for new questions less frequently than once a minute. `wait` values less than 60 are ignore.


License
-------

MIT
