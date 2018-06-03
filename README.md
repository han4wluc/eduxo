
# Eduxora

Eduxora is a state management library based on redux.
This library provides 2 value propositions:
* Dispath functions in redux do not support types.
* Writing new redux logic is time consuming due to the amount of files that one needs to manage.

Problem one is solved by using typescript and adding a layer of functions called 'dispatchers'
Problem two is solved by prividing an API inspired by dvajs.

All actions are still done through redux dispatch. You can still write your own middleware.

