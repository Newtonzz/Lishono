// Learn more: https://docs.expo.dev/guides/customizing-metro/
const { getDefaultConfig } = require("expo/metro-config");

const config = getDefaultConfig(__dirname);

// @supabase/supabase-js does an optional dynamic import of "@opentelemetry/api".
// It's not a real dependency here, so Metro can't resolve it and the bundle
// fails. Stub it out — Supabase falls back gracefully when it's absent.
const upstreamResolveRequest = config.resolver.resolveRequest;
config.resolver.resolveRequest = (context, moduleName, platform) => {
  if (moduleName === "@opentelemetry/api") {
    return { type: "empty" };
  }
  const resolver = upstreamResolveRequest || context.resolveRequest;
  return resolver(context, moduleName, platform);
};

module.exports = config;
