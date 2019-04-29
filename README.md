# @phnq/log

[![npm version](https://badge.fury.io/js/%40phnq%2Flog.svg)](https://badge.fury.io/js/%40phnq%2Flog)

Super basic, no frills logging for client or server.

## Features

- Very few features, very inflexible
- Colourized log category (based on category name)
- Extremely basic regex-based category matching for enabling/disabling loggers

## Usage

```ts
import { createLogger } from "@phnq/log";

const serverLog = createLogger("server");

serverLog("Server starting on port %d", process.env.PORT);
```
