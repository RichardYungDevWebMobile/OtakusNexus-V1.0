import fs from "fs";
import path from "path";

const root = "otakus-nexus";

const files = [
  "app/_layout.jsx",
    "app/index.jsx",
      "app/(onglets)/_layout.jsx",
        "app/(onglets)/nexus.jsx",
          "app/(onglets)/Communities.jsx",
            "app/(onglets)/waifu.jsx",
              "app/(onglets)/ai.jsx",
                "app/(onglets)/profile.jsx",
                  "app/(authentifié)/_layout.jsx",
                    "app/(authentifié)/login.jsx",
                      "app/(authentifié)/register.jsx",
                        "app/chat/[id].jsx",
                          "app/community/[id].jsx",
                            "app/premium/subscribe.jsx",
                              "app/watch-party/[id].jsx",

                                "lib/api/client.js",
                                  "lib/api/endpoints.js",
                                    "lib/api/interceptors.js",

                                      "lib/auth/auth-context.jsx",
                                        "lib/auth/use-auth.js",
                                          "lib/auth/secure-store.js",

                                            "lib/messaging/chat-engine.js",
                                              "lib/messaging/message-store.js",
                                                "lib/messaging/realtime.js",
                                                  "lib/messaging/encryption.js",

                                                    "lib/ai/ai-manager.js",
                                                      "lib/ai/chat-persistence.js",
                                                        "lib/ai/quota-manager.js",
                                                          "lib/ai/providers/openai.js",
                                                            "lib/ai/providers/replicate.js",
                                                              "lib/ai/providers/huggingface.js",

                                                                "lib/storage/local-storage.js",
                                                                  "lib/storage/google-drive.js",
                                                                    "lib/storage/encryption.js",
                                                                      "lib/storage/backup-manager.js",

                                                                        "lib/monetization/subscription-manager.js",
                                                                          "lib/monetization/in-app-purchases.js",
                                                                            "lib/monetization/revenue-cat.js",
                                                                              "lib/monetization/premium-features.js",

                                                                                "lib/communities/community-manager.js",
                                                                                  "lib/communities/moderation.js",
                                                                                    "lib/communities/events.js",

                                                                                      "lib/gamification/xp-system.js",
                                                                                        "lib/gamification/badge-manager.js",
                                                                                          "lib/gamification/leaderboard.js",

                                                                                            "lib/theme/theme-context.jsx",
                                                                                              "lib/theme/theme-manager.js",
                                                                                                "lib/theme/anime-themes.js",

                                                                                                  "lib/config/environment.js",
                                                                                                    "lib/config/feature-flags.js",
                                                                                                      "lib/config/constants.js",

                                                                                                        "lib/utils/animations.js",
                                                                                                          "lib/utils/formatters.js",
                                                                                                            "lib/utils/validators.js",
                                                                                                              "lib/utils/logger.js",

                                                                                                                "lib/hooks/use-debounce.js",
                                                                                                                  "lib/hooks/use-network.js",
                                                                                                                    "lib/hooks/use-permissions.js",
                                                                                                                      "lib/hooks/use-analytics.js",

                                                                                                                        "components/ui/button.jsx",
                                                                                                                          "components/ui/input.jsx",
                                                                                                                            "components/ui/card.jsx",
                                                                                                                              "components/ui/modal.jsx",
                                                                                                                                "components/ui/skeleton.jsx",

                                                                                                                                  "components/chat/message-bubble.jsx",
                                                                                                                                    "components/chat/chat-input.jsx",
                                                                                                                                      "components/chat/reactions.jsx",
                                                                                                                                        "components/chat/typing-indicator.jsx",

                                                                                                                                          "components/ai/ai-chat-interface.jsx",
                                                                                                                                            "components/ai/image-generator.jsx",
                                                                                                                                              "components/ai/ai-quota-display.jsx",

                                                                                                                                                "components/premium/premium-badge.jsx",
                                                                                                                                                  "components/premium/subscription-card.jsx",
                                                                                                                                                    "components/premium/feature-comparison.jsx",

                                                                                                                                                      "components/shared/avatar.jsx",
                                                                                                                                                        "components/shared/loading.jsx",
                                                                                                                                                          "components/shared/error-boundary.jsx",

                                                                                                                                                            "assets/fonts/.gitkeep",
                                                                                                                                                              "assets/images/.gitkeep",
                                                                                                                                                                "assets/lottie/.gitkeep",

                                                                                                                                                                  "locales/en.json",
                                                                                                                                                                    "locales/fr.json",
                                                                                                                                                                      "locales/es.json",
                                                                                                                                                                        "locales/zh.json",

                                                                                                                                                                          "scripts/setup-env.js",
                                                                                                                                                                            "scripts/backup-restore.js",

                                                                                                                                                                              ".env.example",
                                                                                                                                                                                "app.json",
                                                                                                                                                                                  "package.json",
                                                                                                                                                                                    "README.md"
                                                                                                                                                                                    ];

                                                                                                                                                                                    for (const file of files) {
                                                                                                                                                                                      const fullPath = path.join(root, file);
                                                                                                                                                                                        fs.mkdirSync(path.dirname(fullPath), { recursive: true });
                                                                                                                                                                                          fs.writeFileSync(fullPath, `// ${file}\n`);
                                                                                                                                                                                          }

                                                                                                                                                                                          console.log("✅ Otakus Nexus créé avec succès");

                                                                                                                                                                                          