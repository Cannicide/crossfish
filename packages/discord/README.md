# @crossfish/discord
Future-compatible Discord.js wrapper with simple syntax and minimal breaking changes.

## Tired of Rewriting Your Entire Bot?
Discord.js notoriously introduces *tons* of breaking changes upon every major version release. Breaking changes between major versions are necessary, of course, when the Discord API updates and removes features over time. However, Discord.js also tends to introduce not-so-necessary breaking changes to syntax solely to improve consistency or term accuracy.

`@crossfish/discord` *will only introduce breaking changes when the Discord API absolutely necessitates it.*

Gone are the days of constantly rewriting half of your bot code every few months because Discord.js arbitrarily decided to make an aesthetic change. With `@crossfish/discord`, you can write code in the latest version of Discord.js and minimize the changes necessary to the code when future updates are released.

## Straightforward and Familiar
`@crossfish/discord` employs a very simple, straightforward functional syntax. The majority of properties and methods follow the familiar naming of Discord.js v14 properties, with a few changes for consistency.

Example (Discord.js v14):
```js
import { member } from '@crossfish/discord/v14';

// client.on("interactionCreate", interaction => {
    // ...

    member(interaction.member).displayName; // => "A Cool User"

    // ...
// }
```

## Forwards Compatibility
Write bot code for Discord.js v14, and the same code will work for all future versions. The only exception is in cases where Discord removes major features from its API. The standard naming conventions and syntax are derived from Discord.js v14.

Example (Discord.js v14):
```js
import { member } from '@crossfish/discord/v14'; // Using v14 bindings

// client.on("interactionCreate", interaction => {
    // ...

    // Default Discord.js:
    interaction.member.displayName; // => "A Cool User"

    // @crossfish/discord:
    member(interaction.member).displayName; // => "A Cool User"

    // ...
// }
```

If Discord.js were to rename `displayName` to something like `guildDisplayName` in a future version (e.g. v15), `@crossfish/discord` can make your life easier.

Example (Hypothetical Discord.js v15):
```js
import { member } from '@crossfish/discord/v15'; // Now using v15 bindings

// client.on("interactionCreate", interaction => {
    // ...

    // Default Discord.js:
    interaction.member.displayName; // => undefined or ERROR

    // @crossfish/discord:
    member(interaction.member).displayName; // => "A Cool User"

    // ...
// }
```

As you can see, `@crossfish/discord` stays consistent across the versions. With plain Discord.js, you would need to manually change every occurrence of `displayName` to `guildDisplayName` -- this could easily add up to hundreds of lines of code that need to be changed. With `@crossfish/discord`, all you need to do is change the import from "v14" to "v15", and we handle the rest.

## Backwards Compatibility
### Deprecated Versions
Backwards compatibility with versions older than v14, such as v13 and v12, is not currently implemented. At the moment, compatibility with future versions of Discord.js is my main focus.

However, backwards compatibility allowing the same code to be written across several major versions would be incredibly useful for converting very old bots into modern ones. If you are interested in adding backwards compatibility, feel free to fork this package and make a pull request.

### Not Feature-Retroactive
New features added in future versions of Discord and Discord.js will unfortunately not, for example, be retroactively added to the v14 bindings of `@crossfish/discord`. The Discord.js v14 bindings will only have access to v14 features, v15 bindings only to v15 features, etc. As new features are released, they will be added to the bindings for the associated Discord.js version.

Over time, the Discord API updates to new versions and deprecates old versions, meaning that very old versions will eventually be removed entirely. That means holdouts desperately clinging to v12 -- when a shiny new version like v16 has just come out -- will probably be forced to update soon anyways. It's just not worth it to retroactively add support for new Discord features to increasingly unsupported older versions.

If backwards compatibility with versions older than v14 is implemented, however, those versions will include all features of v14 -- I intend to make Discord.js v14 the feature baseline of this package.

Using the cross-version consistent syntax of `@crossfish/discord` to easily update to a newer version, on the other hand, should make up for this. Not needing to retroactively add support for newer features should also allow pumping out updates and new version bindings faster.

## Features
`@crossfish/discord` wraps around the following Discord.js structures:
- Guild
- Channel (all types)
- Message
- Message Component (all types) and Message Embed
- Interaction (all types)
- Guild Member
- User
- *More to be added in the future, across all versions*

This package supports all properties and methods on these structures added by the used version of Discord.js. Most properties and methods are identical in name and functionality to those of Discord.js v14. Some properties and methods, however, have been lightly renamed to improve consistency from the get-go.

## Credits
Created by **Cannicide#2753**