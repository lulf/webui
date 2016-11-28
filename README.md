# EnMasse web ui

The EnMasse web UI is originally based on [oshinko-webui](https://github.com/radanalyticsio/oshinko-webui), but modified to work with EnMasse.

### Running the app during development

You'll need to have a node environment installed.
You might prefer to use nvm (https://github.com/creationix/nvm)
to manage my node environment.
Once that is set up, you can run the following:

    npm install
    npm install -g bower
    bower install

Now you're ready to run the enmasse-webui server.

Set the following environment variables:

    OPENSHIFT_ENMASSE_REST=<IP or dns entry of the enmasse rest server>
    OPENSHIFT_ENMASSE_REST_PORT=<Port for the enmasse rest server>
    OPENSHIFT_NODEJS_PORT=<Port to listen on>  Default:8080

Optionally, you can set the following if you want more verbose logging:

    OPENSHIFT_ENMASSE_WEB_DEBUG=true

You can pick one of these options:

* install node.js and run `node server.js`

Then navigate your browser to `http://localhost:<port>` to see the app running in
your browser.


### Running the app in production
The enmasse-webui is meant to run inside Openshift.  You can build the image
from the Dockerfile.  The resultant image can be run standalone or inside
Openshift.

You will need to set the following environment variables:

    OPENSHIFT_ENMASSE_REST=<IP or dns entry of the enmasse rest server>
    OPENSHIFT_ENMASSE_REST_PORT=<Port for the enmasse rest server>
    OPENSHIFT_NODEJS_PORT=<Port that the enmasse-webui will listen on>  Default:8080


### Running unit tests
To run the unit tests:

    karma start test/karma.conf.js


### End to end testing
You'll need protractor installed:

    npm install -g protractor

<optional> Then run:

    webdriver-manager update

You may need to update `test/conf.js` to point to your correct `baseUrl` [default is `http://localhost:8080`] Or, you can pass `--baseUrl=<your baseUrl>` on the protractor command line

    webdriver-manager start

From another terminal window, you can run:

    protractor test/conf.js

### Continuous Integration
