# acquire-legends

_[Click here](http://acquire-legends.herokuapp.com) for demo_

# Contributing guidelines

Welcome buddy, We are happy to see you here. We request you to read all guides before contributing.

For styling guide [click here](../../style)

## Table of Contents

* [Prerequisites](#Prerequisites)
* [Project Skeleton](#Project-Skeleton)
* [Setup for development](#Setup-for-development)
* [Contribution](#Contribution)

<h4 id="Prerequisites"> Prerequisites </h4>

> _You just need to be aware of using below things <br/>_

* Node
* ExpressJs
* AJAX
* Mocha
* Chai
* Supertest

<h4 id="Project-Skeleton"> Project Skeleton </h4>

```
Acquire/
├─ public/
│  ├─ css/
│  ├─ js/
│  ├─ assets/
│  └─ *.html
├─ src/
│  ├─ handlers/
│  └─ models/
├─ test/
│  ├─ helpers/
│  ├─ integration/
│  ├─ unit/
│  └─ functional/
├─ templates/
├─ logs/
│  └─  *.log
├─ .gitignore
├─ .jshintc
├─ .eslintrc
├─ README.md
├─ .editorconfig
├─ package.json
└─ setup.sh
```
#### Setup for development ####
 To contribute for this project you need to do the following things.
 1. clone the repository
  ```
  > git clone https://github.com/step-tw/acquire-legends
  ```
 2. Run setup file from your project root directory

  ```bash
   ➜  acquire-legends$ bin/setup.sh
  ```
 3. Run tools file from your project root directory to install testing tools globally

  ```bash
  ➜  acquire-legends$ bin/tools.sh
  ```
 4. To start the application run npm start
  ```bash
   > npm start
  ```

#### Contribution ####

After preparing development environment , select a issue that you want to work on and assign it to yourself.

As a pair follow ` TDD ` write tests to cover  every line of code you added.

## Important ##

* Our tools file included editorconfig plugin for atom
  * for other editors please install `editorconfig` plugin for your editor
* Make sure your all log files are in logs directory and with extension `.log`
