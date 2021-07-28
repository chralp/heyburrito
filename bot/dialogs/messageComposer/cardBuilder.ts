import * as ACData from "adaptivecards-templating";
import * as AdaptiveCards from "adaptivecards";

// Define a template payload
const SCOREBOARD_TEMPLATE = 
{
    "$schema": "http://adaptivecards.io/schemas/adaptive-card.json",
    "type": "AdaptiveCard",
    "version": "1.3",
    "body": [
        {
            "type": "TextBlock",
            "text": "Donut leaderboards for ${contextType} ${contextDisplayName}!",
            "size": "Large",
            "isSubtle": true,
            "wrap": true,
            "separator": true
        },
        {
            "$data": "${list}",
            "type": "ColumnSet",
            "columns": [
                {
                    "type": "Column",
                    "width": "stretch",
                    "items": [
                        {
                            "type": "TextBlock",
                            "text": "${$data.displayName}",
                            "separator": true
                        }
                    ],
                    "height": "stretch"
                },
                {
                    "type": "Column",
                    "width": "stretch",
                    "items": [
                        {
                            "type": "TextBlock",
                            "text": "${$data.score} 🍩"
                        }
                    ]
                }
            ],
            "separator": true
        }
    ]
};

export function createScoreboardCard(scoresToDisplay: {displayName: string, score: number}[], 
    contextType: string, 
    contextDisplayName: string
) {
    // Create a Template instance from the template payload
    const template = new ACData.Template(SCOREBOARD_TEMPLATE);

    // Create a data binding context, and set its $root property to the
    // data object to bind the template to
    const context: ACData.IEvaluationContext = {
        $root: {
            contextType,
            contextDisplayName,
            "list": scoresToDisplay
        }
    };

    // "Expand" the template - this generates the final Adaptive Card,
    // ready to render
    var card = template.expand(context);

    // Render the card
    var adaptiveCard = new AdaptiveCards.AdaptiveCard();
    adaptiveCard.parse(card);
    return adaptiveCard;
}