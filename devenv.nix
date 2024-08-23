{ pkgs, lib, config, inputs, ... }:

{
  packages = with pkgs; [
    supabase-cli
  ];
  languages.javascript.enable = true;
  languages.javascript.npm.enable = true;
  processes.dev-server = {
    exec = "npm run dev";
    process-compose.environment = [
      "FORCE_COLOR=1"
    ];
  };
}
