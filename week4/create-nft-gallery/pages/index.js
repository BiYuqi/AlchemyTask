import React, { useState } from 'react'
import { NFTCard } from "../components/nftCard"

const Home = () => {
  const [wallet, setWalletAddress] = useState("");
  const [collection, setCollectionAddress] = useState("");
  const [NFTs, setNFTs] = useState([])
  const [fetchForCollection, setFetchForCollection]=useState(false)

  const handleWallet = (e) => {
    setWalletAddress(e.target.value)
  }

  const handleCollectionAddr = (e) => {
    setCollectionAddress(e.target.value)
  }

  const fetchNFTs = async() => {
    let nfts;
    console.log("fetching nfts");
    const api_key = process.env.NEXT_PUBLIC_API_KEY
    const baseURL = `https://eth-mainnet.alchemyapi.io/v2/${api_key}/getNFTs/`;
    const requestOptions = {
      method: 'GET'
    };

    if (!collection.length) {
      const fetchURL = `${baseURL}?owner=${wallet}`;
      nfts = await fetch(fetchURL, requestOptions).then(data => data.json())
    } else {
      console.log("fetching nfts for collection owned by address")
      const fetchURL = `${baseURL}?owner=${wallet}&contractAddresses%5B%5D=${collection}`;
      nfts= await fetch(fetchURL, requestOptions).then(data => data.json())
    }

    if (nfts) {
      console.log("nfts:", nfts)
      setNFTs(nfts.ownedNfts)
    }
  }

  const fetchNFTsForCollection = async () => {
    if (collection.length) {
      const requestOptions = {
        method: 'GET'
      };
      const api_key = process.env.NEXT_PUBLIC_API_KEY
      const baseURL = `https://eth-mainnet.alchemyapi.io/v2/${api_key}/getNFTsForCollection/`;
      const fetchURL = `${baseURL}?contractAddress=${collection}&withMetadata=${"true"}`;
      try {
        const nfts = await fetch(fetchURL, requestOptions).then(data => data.json())
        if (nfts) {
          console.log("NFTs in collection:", nfts)
          setNFTs(nfts.nfts)
        }
      } catch (e) {
        console.log(e.message)
      }
    } else {
      console.log('没有要查询的地址')
    }
  }

  const letsGo = async () => {
    console.log(fetchForCollection)
    if (fetchForCollection) {
      await fetchNFTsForCollection()
    } else {
      await fetchNFTs()
    }
  }

  return (
    <div className="flex flex-col items-center justify-center py-8 gap-y-3">
      <div className="flex flex-col w-full justify-center items-center gap-y-2">
        <input className="w-2/5 border p-1 focus:outline-none focus:ring-2 focus:ring-purple-600 focus:border-transparent" onChange={handleWallet} value={wallet} type={"text"} placeholder="Add your wallet address"></input>
        <input className="w-2/5 border p-1 focus:outline-none focus:ring-2 focus:ring-purple-600 focus:border-transparent" onChange={handleCollectionAddr} value={collection} type={"text"} placeholder="Add the collection address"></input>
        <label className="text-gray-600 "><input onChange={(e)=>{setFetchForCollection(e.target.checked)}} type={"checkbox"} className="mr-2"></input>Fetch for collection</label>
        <button
          className={"disabled:bg-slate-500 text-white bg-blue-400 px-4 py-2 mt-3 rounded-sm w-2/5"}
          onClick={letsGo}
        >
          Let's go!
        </button>
      </div>
      <div className='flex flex-wrap gap-y-12 mt-4 w-5/6 gap-x-2 justify-center'>
        {
          NFTs.length && NFTs.map(nft => {
            return (
              <NFTCard nft={nft}></NFTCard>
            )
          })
        }
      </div>
    </div>
  )
}

export default Home
