# Health

## Inputs

Do not paste a provider name into the repo. The provider comes from integrations.health_get.

## Call

integrations.health_get is free. Call it before the sync so the provider is the one the workspace returns. Call it again after the sync. Read queue depth, failed, dead, and last success.

## Show the owner

The provider, then those four numbers. dead is not a success. reconnect_needed means a person has to reconnect. This skill cannot reconnect it.

## Failure cases

You report queued as done. Do not.
You skip the health read and guess a provider. Do not.
