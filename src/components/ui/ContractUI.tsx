'use client'

import React, { useState, useEffect } from 'react'
import { Button } from "@/components/ui/button"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Copy, Code, ExternalLink, Check, Loader2 } from 'lucide-react'
import { publicClient } from '@/walletConnect/siwe'
import { useWalletClient, useAccount } from 'wagmi'
import { contractsArray } from '@/lib/contractCompile'
import { PieChart } from 'react-minimal-pie-chart'

export function SmartContractDisplay({ contractCode }: { contractCode: string }) {
  const [isDeployed, setIsDeployed] = useState(false)
  const [showCode, setShowCode] = useState(true)
  const [deployedAddress, setDeployedAddress] = useState<string>('')
  const [isCopied, setIsCopied] = useState(false)
  const { data: walletClient } = useWalletClient()
  const { address: walletAddress } = useAccount()
  const [solidityScanResults, setSolidityScanResults] = useState<any>(null)
  const [showScanComments, setShowScanComments] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [closestContractIndex, setClosestContractIndex] = useState<number>(-1)
  const [closestContract, setClosestContract] = useState<any>(null)

  const handleCopy = () => {
    navigator.clipboard.writeText(contractCode)
    setIsCopied(true)
    setTimeout(() => setIsCopied(false), 2000)
  }

  useEffect(() => {
    // IMPROVED: Better contract matching algorithm
    const findBestMatch = () => {
      // First, try keyword matching
      const keywords = {
        0: ['eth', 'erc20', 'token', 'usdc', 'dai', 'usdt'],
        1: ['eth', 'nft', 'erc721', 'collectible'],
        2: ['nft', 'erc20', 'token', 'erc721'],
        3: ['nft', 'nft', 'erc721', 'swap nft'],
        4: ['erc20', 'token', 'swap token', 'trade token']
      };

      const contractLower = contractCode.toLowerCase();
      
      // Score each contract
      const scores = contractsArray.map((contract, index) => {
        let score = 0;
        
        // Check for contract name match
        if (contractLower.includes(contract.name.toLowerCase().replace(/escrow|contract/gi, '').trim())) {
          score += 50;
        }
        
        // Check for keyword matches
        if (keywords[index as keyof typeof keywords]) {
          keywords[index as keyof typeof keywords].forEach(keyword => {
            if (contractLower.includes(keyword)) score += 10;
          });
        }
        
        // Check structural similarity (imports, struct names)
        const contractStructs = contract.contractCode.match(/struct\s+(\w+)/g) || [];
        contractStructs.forEach(struct => {
          if (contractCode.includes(struct)) score += 15;
        });
        
        return { index, score };
      });

      // Find highest score
      const bestMatch = scores.reduce((best, current) => 
        current.score > best.score ? current : best
      );

      // If no good match found (score < 20), default to index 0
      const selectedIndex = bestMatch.score >= 20 ? bestMatch.index : 0;
      
      console.log("📊 Contract matching scores:", scores);
      console.log("✅ Selected contract index:", selectedIndex, "with score:", bestMatch.score);

      return selectedIndex;
    };

    const matchIndex = findBestMatch();
    setClosestContractIndex(matchIndex);
    setClosestContract(contractsArray[matchIndex]);
    
    if (contractsArray[matchIndex]?.solidityScanResults) {
      setSolidityScanResults(contractsArray[matchIndex].solidityScanResults);
    }
  }, [contractCode]);

  const useDeployContract = async ({ sourceCode }: { sourceCode: string }) => {
    try {
      if (!closestContract) {
        throw new Error("No matching contract found");
      }

      if (!walletClient || !walletAddress) {
        throw new Error("Please connect your wallet first");
      }

      console.log("🚀 Deploying contract:", closestContract.name);
      const { abi, bytecode } = closestContract;

      //@ts-ignore
      const hash = await walletClient.deployContract({
        //@ts-ignore
        abi,
        bytecode: `0x${bytecode}`,
        account: walletAddress,
        args: [],
      });

      console.log('📝 Contract deployment transaction hash:', hash);

      if (hash) {
        const receipt = await publicClient.waitForTransactionReceipt({ hash });
        console.log('✅ Contract deployed at:', receipt.contractAddress);
        return { 
          contractAddress: receipt.contractAddress, 
          contractIndex: closestContractIndex 
        };
      }
    } catch (error: any) {
      console.error('❌ Deployment error:', error);
      
      // Better error messages
      if (error.message.includes("rejected")) {
        throw new Error("Transaction was rejected by user");
      } else if (error.message.includes("insufficient funds")) {
        throw new Error("Insufficient funds for deployment");
      } else {
        throw new Error(`Deployment failed: ${error.message}`);
      }
    }
  }

  const useHandleDeploy = async () => {
    if (!walletClient || !walletAddress) {
      alert("Please connect your wallet first!");
      return;
    }

    setIsLoading(true);
    
    try {
      const result = await useDeployContract({ sourceCode: contractCode });

      if (result && result.contractAddress) {
        setDeployedAddress(result.contractAddress);
        setShowCode(false);
        setIsDeployed(true);
      }
    } catch (error: any) {
      console.error("Deployment error:", error);
      alert(error.message || "Deployment failed. Please try again.");
    } finally {
      setIsLoading(false);
    }
  }

  const toggleCode = () => {
    setShowCode(!showCode)
  }
 
  const roundedSecurityScore = Math.round(solidityScanResults?.securityScore || 0);
  const roundedThreatScore = Math.round(solidityScanResults?.threatScore || 0);

  return (
    <div className="w-full max-w-2xl bg-gray-900 text-white rounded-md overflow-hidden border border-white font-mono">
      <div className="p-4">
        <div className="flex justify-between items-center mb-2">
          <h3 className="text-lg font-semibold">
            {closestContract?.name || "Escrow Contract"}
          </h3>
          {!isDeployed && (
            <Button
              onClick={handleCopy}
              variant="outline"
              size="sm"
              className="text-white border-white hover:bg-white hover:text-black"
            >
              {isCopied ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
            </Button>
          )}
        </div>
        {showCode && (
          <ScrollArea className="h-96 w-full border border-white rounded-md p-2">
            <pre className="text-sm">
              <code>{contractCode}</code>
            </pre>
          </ScrollArea>
        )}
       {isDeployed && !showCode && (
  <div className="bg-gray-900 p-4 rounded-md border border-[#0EA5E9] mb-4">
    <div className="space-y-2">
      <p className="text-green-400 font-semibold">✅ Contract deployed successfully!</p>
      <p className="text-sm">
        <span className="text-gray-300">Contract Address:</span>{' '}
        <span 
          className="text-blue-400 break-all cursor-pointer hover:text-blue-300" 
          onClick={() => {
            navigator.clipboard.writeText(deployedAddress);
            alert("Address copied!");
          }} 
          title="Click to copy"
        >
          {deployedAddress}
        </span>
      </p>
      <div className="mt-4">
        <p className="text-sm text-gray-300 mt-2 mb-2">Audit your deployed contract:</p>
        <Button 
          onClick={() => window.open(`https://solidityscan.com/quickscan/${deployedAddress}/blockscout/arbitrum-sepolia`, '_blank')} 
          className="bg-[#0EA5E9] text-black rounded-none hover:bg-[#0EA5E9]/80 transition-colors duration-200"
        >
          <ExternalLink className="w-4 h-4 mr-2" />
          SolidityScan Audit
        </Button>
      </div>
    </div>
  </div>
)}
</div>
<div className="bg-[#0EA5E9] text-black p-4 flex justify-between items-center rounded-b-md">
  {!isDeployed ? (
    <Button 
      onClick={useHandleDeploy} 
      disabled={isLoading}
      className="bg-black text-white border border-white hover:bg-white hover:text-black transition-colors duration-200 disabled:opacity-50"
    >
      {isLoading ? (
        <>
          <Loader2 className="w-4 h-4 mr-2 animate-spin" />
          Deploying...
        </>
      ) : (
        'Deploy Contract'
      )}
    </Button>
  ) : (
    <>
      <Button
        onClick={toggleCode}
        variant="outline"
        size="sm"
        className="bg-black text-white border border-white hover:bg-white hover:text-black transition-colors duration-200 flex items-center"
      >
        <Code className="w-4 h-4 mr-2" />
        {showCode ? 'Hide Code' : 'Show Code'}
      </Button>
      <a
        href={`https://sepolia.arbiscan.io/address/${deployedAddress}`}
        target="_blank"
        rel="noopener noreferrer"
        className="bg-black text-white px-4 py-2 rounded-md hover:bg-white hover:text-black transition-colors duration-200 flex items-center"
      >
        View on Arbiscan <ExternalLink className="w-4 h-4 ml-2" />
      </a>
    </>
  )}
</div>
      {solidityScanResults && (
  <div className="p-4 border-t border-white">
    <h4 className="text-lg font-semibold mb-4">SolidityScan Results</h4>
    <div className="flex items-start mb-6">
      <div className="w-1/2 pr-4">
        <div className="w-32 h-32 mx-auto">
          <PieChart
            data={[
              { value: roundedSecurityScore, color: '#0EA5E9' },
              { value: 100 - roundedSecurityScore, color: '#333' }
            ]}
            totalValue={100}
            lineWidth={20}
            label={() => `${roundedSecurityScore}`}
            labelStyle={{ fontSize: '22px', fill: '#fff' }}
            labelPosition={0}
          />
        </div>
        <p className="text-center mt-2 text-sm">Security Score</p>
      </div>
      <div className="w-1/2 pl-4">
        <div className="w-32 h-32 mx-auto">
          <PieChart
            data={[
              { value: roundedThreatScore, color: '#FF69B4' },
              { value: 100 - roundedThreatScore, color: '#333' }
            ]}
            totalValue={100}
            lineWidth={20}
            label={() => `${roundedThreatScore}` }
            labelStyle={{ fontSize: '22px', fill: '#fff' }}
            labelPosition={0}
          />
        </div>
        <p className="text-center mt-2 text-sm">Threat Score</p>
      </div>
    </div>
    <Button 
      onClick={() => setShowScanComments(!showScanComments)} 
      className="mb-4 bg-black text-white border border-white hover:bg-white hover:text-black transition-colors duration-200 w-full"
    >
      {showScanComments ? 'Hide' : 'Show'} Scan Details
    </Button>
    {showScanComments && (
      <div className="text-sm mt-2 space-y-4">
        <div className="bg-gray-900 p-3 rounded-md">
          <h5 className="font-semibold mb-2 text-[#0EA5E9]">Security Score:</h5>
          <p>{solidityScanResults.securityScoreComments}</p>
        </div>
        <div className="bg-gray-900 p-3 rounded-md">
          <h5 className="font-semibold mb-2 text-[#FF69B4]">Threat Analysis:</h5>
          <p>{solidityScanResults.securityScanComments}</p>
        </div>
      </div>
    )}
  </div>
)}
    </div>
  )
}