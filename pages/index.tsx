import type { NextPage } from 'next'
import { useState } from 'react'
import Head from 'next/head'
import Image from 'next/image'
import styles from '../styles/Home.module.css'
import AddressForm from '../components/AddressForm'
import * as web3 from '@solana/web3.js'

const Home: NextPage = () => {
  const [balance, setBalance] = useState(0)
  const [address, setAddress] = useState('')
  const [isExecutable, setIsExecutable] = useState('')

  const addressSubmittedHandler = async (address: string) => {
    try{
      const key = new web3.PublicKey(address);
      setAddress(key.toBase58());
      const connection = new web3.Connection(web3.clusterApiUrl('devnet'))
      connection.getBalance(key).then((balance) => {
       setBalance(balance / web3.LAMPORTS_PER_SOL);
      })
      await getAccountInfoBalanceUsingJSONRPC(address);
    } catch(error){
      setAddress('')
      setBalance(0)
      alert(error)
    }
  }

  async function getAccountInfoBalanceUsingJSONRPC(address: string): Promise<void> {
    const url = web3.clusterApiUrl('devnet')
    console.log(url);
    return fetch(url, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
            "jsonrpc": "2.0",
            "id": 1,
            "method": "getAccountInfo",
            "params": [
                address
            ]
        })
    }).then(response => response.json())
    .then(json => {
        if (json.error) {
            throw json.error
        }
        if(json['result']['value']['executable'] === true)
          setIsExecutable('Yay!!!');
        else 
          setIsExecutable('Nope!');
    })
    .catch(error => {
        throw error
    })
}

  return (
    <div className={styles.App}>
      <header className={styles.AppHeader}>
        <p>
          Start Your Solana Journey
        </p>
        <AddressForm handler={addressSubmittedHandler} />
        <p>{`Address: ${address}`}</p>
        <p>{`Balance: ${balance} SOL`}</p>
        <p>{`is Executable : ${isExecutable}`}</p>
      </header>
    </div>
  )
}

export default Home
