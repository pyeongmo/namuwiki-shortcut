{ pkgs, ... }:
{
  # See https://www.jetpack.io/devbox/docs/configuration/ for more details
  # on how to configure your devbox.
  packages = [ pkgs.nodejs_20 pkgs.typescript ];

  # You can also create services and preview your services
  # in the side panel.
  # services = {
  #   web = {
  #     env = "FLASK_APP=hello.py";
  #     start = "flask run --host 0.0.0.0 --port 8080";
  #     preview = true;
  #   };
  # };
  idx = {
    workspace = {
      onCreate = { npm-install = "npm install"; };
    };
  };
}
