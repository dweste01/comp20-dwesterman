README

Danielle Westerman

1. I believe I have correctly implemented everything, by using XMLHttpRequest
to parse data from JSON.

2. I worked essentially by myself.

3. I spent approximately 3 hours.

When using XMLHttpRequest, it is not possible to request data from a different
origin due to the same-origin policy. This policy makes sure a page will only
interact with pages from the same origin as a security measure. In order to
be considered from the same origin, two pages must have the same protocol,
port, and host. When attempting to open http://messagehub.herokuapp.com/, an
error is created that says "Cross-Origin Request Blocked: The Same Origin
Policy disallows reading the remote resource at http://messagehub.herokuapp.com/.
This can be fixed by moving the resource to the same domain or enabling CORS."
If Cross-Origin Requests were enabled, then a website using javascript
would be able to to access all the information on any other currently-running
website using javascript.
