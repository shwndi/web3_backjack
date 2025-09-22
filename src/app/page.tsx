"use client"

import { useEffect, useState } from "react"

// 这是一个React函数组件
export default function Page() {
  // 定义扑克牌的点数和花色
  const ranks = ["A", "2", "3", "4", "5", "6", "7", "8", "9", "10", "J", "Q", "K"]
  const suits = ["♥️", "♦️", "♠️", "♣️"]

  // 创建一副完整的扑克牌
  const initialDeck = ranks.map(rank => suits.map(suit => ({ rank, suit }))).flat()

  // useState用来创建一个"状态"，这里创建的是一个叫"deck"的牌组状态
  // deck: 用来保存当前的牌组数据
  // setDeck: 用来修改牌组数据的函数
  // <{rank: string, suit: string}[]>: 这是告诉电脑这个状态的数据格式
  const [deck, setDeck] = useState<{ rank: string, suit: string }[]>([])
  const [winner, setWinner] = useState("")
  const [message, setMessage] = useState("  ")
  // useEffect用来在页面加载时执行一些操作
  // 这里的意思是：当页面第一次加载时，把initialDeck（完整的牌组）设置到deck状态中
  useEffect(() => {
    // 使用setDeck函数把initialDeck赋值给deck状态
    setDeck(initialDeck)
    setWinner("player")
    setMessage("Balck Jack!")
  }, []) // 这个[]表示只在页面第一次加载时执行一次

  return (
    <div className="flex flex-col items-center justify-center h-screen bg-gray-300">
      <h1 className="text-3xl bold ">welcome to web3 game Back jack</h1>
      {/* <h2 className="text-2xl bold">Message: player wins/dealer wins:Balckjack wins!</h2> */}
      <h2 className={`text-2xl bold ${winner==="player" ?"bg-green-300":"bg-amber-300"}`}>{message}</h2>
      <div className="mt-4" >
        <h2 >Dealer`s hand</h2>
        <div className="flex flex-row gap-2">
          {
            deck.slice(0, 3).map((card, index) => (
              <div key={index} className="w-32 h-42 border-1 border-black bg-white  rounded-md flex flex-col justify-between"> 
                <p className="self-start p-2 text-lg">{card.rank}</p>
                <p className="self-center p-2 text-3xl">{card.suit}</p>
                <p className="self-end p-2 text-lg">{card.rank}</p>
              </div>
            ))
          }

          {/* <div className="w-32 h-42 border-1 border-black bg-white  rounded-md"></div>
          <div className="w-32 h-42 border-1 border-black bg-white  rounded-md"></div>
          <div className="w-32 h-42 border-1 border-black bg-white  rounded-md"></div> */}
        </div>
      </div>

      <div >
        <h2 >player`s hand</h2>
        <div className="flex flex-row gap-2">{
          deck.slice(0,3).map((card, index) => (
            <div key={index} className="w-32 h-42 border-1 border-black bg-white  rounded-md flex flex-col justify-between"> 
              <p className="self-start p-2 text-lg">{card.rank}</p>
              <p className="self-center p-2 text-3xl">{card.suit}</p>
              <p className="self-end p-2 text-lg">{card.rank}</p>
            </div>
          ))
          }
        </div>
      </div>
      <div className="flex flex-row gap-2 mt-4">
        <button className="bg-amber-300  rounded-md p-2">Hit</button>
        <button className="bg-amber-300  rounded-md p-2">Stand</button>
        <button className="bg-amber-300  rounded-md p-2">Reset</button>
      </div>
    </div>
  )
}