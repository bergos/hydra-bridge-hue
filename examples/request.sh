#!/bin/bash

DIR="$(dirname "${BASH_SOURCE[0]}")"

curl http://localhost:9000/hue/group/2 -v -X PUT -H "content-type: text/turtle" --data-binary @$DIR/data.ttl
#curl http://localhost:9000/hue/light/1/state -v -X PUT -H "content-type: text/turtle" --data-binary @data.ttl
