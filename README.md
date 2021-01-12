# shopify-bones-injector

Automatically inject files (primarily `.liquid`) from a Shopify Bones package into your project on install

For use with projects such as [shopify-bones-cart](https://github.com/thetechdept/shopify-bones-cart).

### What does it do?

It makes it so that, when you install a package (such as [shopify-bones-cart](https://github.com/thetechdept/shopify-bones-cart)), into your project it will copy and paste files from its `/injections` dir into your project.

### What else does it do?

For `.liquid` files specifically it minifies them, to prevent accidental editing (as it will be overwritten on `npm install`/`npm update` anyway.

You can include a big explanation `{%- comment -%}!` like that, with a `!`, which won't get minified.

## Install (into your own `shopify-bones` package)

```bash
npm i @thetechdept/shopify-bones-injector
```

`package.json`

```json
    "postinstall": "node ../../@thetechdept/shopify-bones-injector"
```
