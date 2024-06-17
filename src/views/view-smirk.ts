import { userMention } from "discord.js";
import { ContextSmirk, Reply, View } from "../interfaces.js";

export class ViewSmirk implements View {
  frontend(context: ContextSmirk): Reply {
    let emoji;
    let who = "";

    if (context.who !== undefined) {
      who = userMention(context.who) + "\n";

      if (context.type && context.type.startsWith("small")) {
        who = userMention(context.who) + " ";
      }
    }

    if (context.type === "reverse") {
      emoji =
        "https://media1.tenor.com/m/UZb0Zsw3584AAAAC/vegeta-phone-smile-reverse.gif";
    } else if (context.type === "small") {
      emoji = "<a:vegetasonrisa_animated:1251677281550598244>";
    } else if (context.type === "small reverse") {
      emoji = "<a:vegeta_non_sonrisa:1251677227574099978>";
    } else {
      emoji =
        "https://media1.tenor.com/m/R10_g5hqfKIAAAAC/vegeta-cellphone.gif";
    }

    return {
      content: who + emoji,
    };
  }
}
