import { get } from "http"

// when the game is inited,get player and dealer 2 random cards respectively
export interface Card {
    rank: string,
    suit: string
}

// 定义扑克牌的点数和花色
const ranks = ["A", "2", "3", "4", "5", "6", "7", "8", "9", "10", "J", "Q", "K"]
const suits = ["♥️", "♦️", "♠️", "♣️"]

// 创建一副完整的扑克牌
const initialDeck = ranks.map(rank => suits.map(suit => ({ rank, suit }))).flat()
const gameState: {
    playerHand: Card[],
    dealerHand: Card[],
    deck: Card[],
    message: string,
} = {
    playerHand: [],
    dealerHand: [],
    deck: initialDeck,
    message: '',
}
function getRandomCard(desk: Card[], count: number) {
    const randomIndexSet = new Set<number>()
    while (randomIndexSet.size < count) {
        const randomIndex = Math.floor(Math.random() * desk.length)
        randomIndexSet.add(randomIndex)
    }
    const randomCard = desk.filter((_, index) => randomIndexSet.has(index))
    const remainingDesk = desk.filter((_, index) => !randomIndexSet.has(index))
    return [randomCard, remainingDesk]
}

export function GET() {
    gameState.playerHand = []
    gameState.dealerHand = []
    gameState.deck = initialDeck
    gameState.message = ""

    const [playerCards, remainingDesk] = getRandomCard(gameState.deck, 2)
    const [dealerCards, newDesk] = getRandomCard(remainingDesk, 2)
    gameState.playerHand = playerCards
    gameState.dealerHand = dealerCards
    gameState.deck = newDesk
    gameState.message = ""

    return new Response(JSON.stringify({
        playerHand: gameState.playerHand,
        dealerHand: [gameState.dealerHand[0], { rank: "?", suit: "?" } as Card],
        message: gameState.message,
    }), {
        status: 200,
    })

}

export async function POST(request: Request) {
    const { action } = await request.json()
    if (action === "hit") {
        // when hit is clicked ,get a random card from the deck and add it to the player's hand
        const [randomCard, newDesk] = getRandomCard(gameState.deck, 1)
        gameState.playerHand.push(...randomCard)
        gameState.deck = newDesk
        // calculate player hand value
        const playerHandValue = calculateHandValue(gameState.playerHand)
        // player hand value is 21 :player wins black jack
        // player hand is more 21 :player loses, bust
        // player hand is less than 21: continue player can hit or stand 
        if (playerHandValue === 21) {
            gameState.message = "Blackjack! player wins."
        } else if (playerHandValue > 21) {
            gameState.message = "Bust! player loses."
        }

    } else if (action === "stand") {
        // when stand is clicked ,get a random card from the deck and add it to the decler hand
        // keep doing this until dealer has 17 or more  points

        while (calculateHandValue(gameState.dealerHand) < 17) {
            const [cards, newDesk] = getRandomCard(gameState.deck, 1)
            gameState.dealerHand.push(...cards)
            gameState.deck = newDesk
        }
        const dealerHandValue = calculateHandValue(gameState.dealerHand)
        if (dealerHandValue > 21) {
            gameState.message = "Dealer busts! player wins."
        } else if (dealerHandValue === 21) {
            gameState.message = "Dealer blackjack! player loses."
        } else {
            const playerHandValue = calculateHandValue(gameState.playerHand)
            if (playerHandValue > dealerHandValue) {
                gameState.message = "Player wins."
            } else if (playerHandValue < dealerHandValue) {
                gameState.message = "Player loses."
            } else {
                gameState.message = "Draw."
            }
        }

        // calculate dealer hand value
        // dealer hand value is 21:player loese, dealer black jack
        // dealer hand is more 21 : player win , dealer bust
        // dealer hand is less than 21:
        //        calculate player hand value
        //        player > dealer: player win
        //        player < dealer: player lose
        //        player == dealer: draw


    } else {
        return new Response(JSON.stringify({
            message: "Invalid action",
        }), {
            status: 400,
        })
    }
    return new Response(JSON.stringify({
        playerHand: gameState.playerHand,
        dealerHand: gameState.message === ""
            ? [gameState.dealerHand[0], { rank: "?", suit: "?" } as Card]
            : gameState.dealerHand,
        message: gameState.message,
    }), {
        status: 200,
    })

}
function calculateHandValue(hand: Card[]) {
    let value = 0
    let aceCount = 0
    for (const card of hand) {
        if (card.rank === "A") {
            aceCount++
            value += 11
        } else if (["K", "Q", "J"].includes(card.rank)) {
            value += 10
        } else {
            value += parseInt(card.rank)
        }
    }
    while (value > 21 && aceCount > 0) {
        value -= 10
        aceCount--
    }
    return value
}
