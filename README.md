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
  --wait         Seconds to wait between checks [default: 60]
  --version, -v  Show version
  --help, -h     Show this message
```

License
-------

MIT
