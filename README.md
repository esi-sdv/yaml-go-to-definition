# Overview

This extension for Visual Studio Code allows you to quickly navigate to the definition of a term within YAML files. <br>
This is particularly useful when working with large YAML configurations, especially if you separate them into multiple files. <br>

## How does it work?

It simply takes the root of your project, compiles all YAML and YML files into one, and retains the original file and line position information. 

## Features

This extension currently supports definitions in the following formats:

```yaml
.thing:
```
or
```yaml
thing:
```
