'use client';

import { useState } from 'react';
import { useAccount, useWriteContract, useWaitForTransactionReceipt } from 'wagmi';
import { parseEther } from 'viem';
import { Card } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { Upload, Loader2, CheckCircle2, AlertCircle } from 'lucide-react';
import { toast } from 'sonner';

// Token Factory ABI (simplified)
const TOKEN_FACTORY_ABI = [
  {
    name: 'createStandardToken',
    type: 'function',
    stateMutability: 'payable',
    inputs: [
      { name: 'name', type: 'string' },
      { name: 'symbol', type: 'string' },
      { name: 'totalSupply', type: 'uint256' },
      { name: 'decimals', type: 'uint8' },
    ],
    outputs: [{ name: '', type: 'address' }],
  },
  {
    name: 'createTaxToken',
    type: 'function',
    stateMutability: 'payable',
    inputs: [
      { name: 'name', type: 'string' },
      { name: 'symbol', type: 'string' },
      { name: 'totalSupply', type: 'uint256' },
      { name: 'decimals', type: 'uint8' },
      { name: 'buyTax', type: 'uint256' },
      { name: 'sellTax', type: 'uint256' },
      { name: 'taxReceiver', type: 'address' },
    ],
    outputs: [{ name: '', type: 'address' }],
  },
] as const;

const FACTORY_ADDRESS = process.env.NEXT_PUBLIC_FACTORY_ADDRESS as `0x${string}`;

export default function TokenCreationForm() {
  const { address, isConnected } = useAccount();
  const { writeContract, data: hash, isPending } = useWriteContract();
  const { isLoading: isConfirming, isSuccess } = useWaitForTransactionReceipt({ hash });

  const [formData, setFormData] = useState({
    name: '',
    symbol: '',
    totalSupply: '',
    decimals: '18',
    hasTax: false,
    buyTax: '0',
    sellTax: '0',
    taxReceiver: '',
    website: '',
    twitter: '',
    telegram: '',
    description: '',
  });

  const [logoFile, setLogoFile] = useState<File | null>(null);
  const [logoPreview, setLogoPreview] = useState<string>('');
  const [uploadingLogo, setUploadingLogo] = useState(false);
  const [logoUrl, setLogoUrl] = useState('');

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value, type } = e.target;
    const checked = (e.target as HTMLInputElement).checked;
    
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value,
    }));
  };

  const handleLogoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setLogoFile(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setLogoPreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const uploadLogo = async () => {
    if (!logoFile) return '';

    setUploadingLogo(true);
    try {
      const formData = new FormData();
      formData.append('file', logoFile);

      const response = await fetch('/api/launchpad/upload-logo', {
        method: 'POST',
        body: formData,
      });

      if (!response.ok) throw new Error('Upload failed');

      const data = await response.json();
      setLogoUrl(data.url);
      return data.url;
    } catch (error) {
      console.error('Logo upload error:', error);
      toast.error('Failed to upload logo');
      return '';
    } finally {
      setUploadingLogo(false);
    }
  };

  const calculateFee = () => {
    let fee = 0.1; // Base fee
    if (formData.hasTax) fee += 0.02;
    return fee;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!isConnected) {
      toast.error('Please connect your wallet');
      return;
    }

    // Upload logo first
    const uploadedLogoUrl = logoFile ? await uploadLogo() : '';

    const fee = calculateFee();
    const taxReceiver = formData.taxReceiver || address;

    try {
      if (formData.hasTax) {
        writeContract({
          address: FACTORY_ADDRESS,
          abi: TOKEN_FACTORY_ABI,
          functionName: 'createTaxToken',
          args: [
            formData.name,
            formData.symbol,
            BigInt(formData.totalSupply),
            Number(formData.decimals),
            BigInt(Number(formData.buyTax) * 100), // Convert to basis points
            BigInt(Number(formData.sellTax) * 100),
            taxReceiver as `0x${string}`,
          ],
          value: parseEther(fee.toString()),
        });
      } else {
        writeContract({
          address: FACTORY_ADDRESS,
          abi: TOKEN_FACTORY_ABI,
          functionName: 'createStandardToken',
          args: [
            formData.name,
            formData.symbol,
            BigInt(formData.totalSupply),
            Number(formData.decimals),
          ],
          value: parseEther(fee.toString()),
        });
      }

      // Save to database after successful deployment
      if (hash) {
        await fetch('/api/launchpad/create', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            ...formData,
            logoUrl: uploadedLogoUrl,
            transactionHash: hash,
            launchFeePaid: fee.toString(),
            chainId: 1, // Update based on connected chain
          }),
        });
      }

      toast.success('Token launched successfully!');
    } catch (error) {
      console.error('Launch error:', error);
      toast.error('Failed to launch token');
    }
  };

  return (
    <Card className="p-8">
      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Basic Info */}
        <div className="space-y-4">
          <h3 className="text-xl font-semibold">Basic Information</h3>
          
          <div className="grid md:grid-cols-2 gap-4">
            <div>
              <Label htmlFor="name">Token Name *</Label>
              <Input
                id="name"
                name="name"
                value={formData.name}
                onChange={handleInputChange}
                placeholder="My Token"
                required
              />
            </div>
            
            <div>
              <Label htmlFor="symbol">Symbol *</Label>
              <Input
                id="symbol"
                name="symbol"
                value={formData.symbol}
                onChange={handleInputChange}
                placeholder="MTK"
                required
              />
            </div>
          </div>

          <div className="grid md:grid-cols-2 gap-4">
            <div>
              <Label htmlFor="totalSupply">Total Supply *</Label>
              <Input
                id="totalSupply"
                name="totalSupply"
                type="number"
                value={formData.totalSupply}
                onChange={handleInputChange}
                placeholder="1000000"
                required
              />
            </div>
            
            <div>
              <Label htmlFor="decimals">Decimals</Label>
              <Input
                id="decimals"
                name="decimals"
                type="number"
                value={formData.decimals}
                onChange={handleInputChange}
                min="0"
                max="18"
              />
            </div>
          </div>

          {/* Logo Upload */}
          <div>
            <Label>Token Logo</Label>
            <div className="flex items-center gap-4 mt-2">
              {logoPreview && (
                <img src={logoPreview} alt="Logo preview" className="w-20 h-20 rounded-full object-cover" />
              )}
              <label className="cursor-pointer">
                <div className="flex items-center gap-2 px-4 py-2 border rounded-lg hover:bg-muted">
                  <Upload className="w-4 h-4" />
                  <span>Upload Logo</span>
                </div>
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleLogoChange}
                  className="hidden"
                />
              </label>
            </div>
          </div>
        </div>

        {/* Tax Features */}
        <div className="space-y-4">
          <div className="flex items-center gap-2">
            <input
              type="checkbox"
              id="hasTax"
              name="hasTax"
              checked={formData.hasTax}
              onChange={handleInputChange}
              className="w-4 h-4"
            />
            <Label htmlFor="hasTax">Enable Buy/Sell Tax (+0.02 ETH)</Label>
          </div>

          {formData.hasTax && (
            <div className="grid md:grid-cols-2 gap-4 pl-6">
              <div>
                <Label htmlFor="buyTax">Buy Tax (%)</Label>
                <Input
                  id="buyTax"
                  name="buyTax"
                  type="number"
                  value={formData.buyTax}
                  onChange={handleInputChange}
                  min="0"
                  max="10"
                  step="0.1"
                />
              </div>
              
              <div>
                <Label htmlFor="sellTax">Sell Tax (%)</Label>
                <Input
                  id="sellTax"
                  name="sellTax"
                  type="number"
                  value={formData.sellTax}
                  onChange={handleInputChange}
                  min="0"
                  max="10"
                  step="0.1"
                />
              </div>

              <div className="md:col-span-2">
                <Label htmlFor="taxReceiver">Tax Receiver Address</Label>
                <Input
                  id="taxReceiver"
                  name="taxReceiver"
                  value={formData.taxReceiver}
                  onChange={handleInputChange}
                  placeholder="0x... (leave empty to use your address)"
                />
              </div>
            </div>
          )}
        </div>

        {/* Social Links */}
        <div className="space-y-4">
          <h3 className="text-xl font-semibold">Social Links (Optional)</h3>
          
          <div className="grid md:grid-cols-2 gap-4">
            <div>
              <Label htmlFor="website">Website</Label>
              <Input
                id="website"
                name="website"
                value={formData.website}
                onChange={handleInputChange}
                placeholder="https://..."
              />
            </div>
            
            <div>
              <Label htmlFor="twitter">Twitter</Label>
              <Input
                id="twitter"
                name="twitter"
                value={formData.twitter}
                onChange={handleInputChange}
                placeholder="@username"
              />
            </div>

            <div>
              <Label htmlFor="telegram">Telegram</Label>
              <Input
                id="telegram"
                name="telegram"
                value={formData.telegram}
                onChange={handleInputChange}
                placeholder="t.me/..."
              />
            </div>
          </div>

          <div>
            <Label htmlFor="description">Description</Label>
            <textarea
              id="description"
              name="description"
              value={formData.description}
              onChange={handleInputChange}
              className="w-full min-h-[100px] px-3 py-2 border rounded-lg"
              placeholder="Describe your token..."
            />
          </div>
        </div>

        {/* Fee Summary */}
        <Card className="p-4 bg-muted">
          <div className="flex justify-between items-center">
            <span className="font-semibold">Total Launch Fee:</span>
            <span className="text-2xl font-bold text-primary">{calculateFee()} ETH</span>
          </div>
        </Card>

        {/* Submit Button */}
        <Button
          type="submit"
          size="lg"
          className="w-full"
          disabled={!isConnected || isPending || isConfirming || uploadingLogo}
        >
          {isPending || isConfirming ? (
            <>
              <Loader2 className="w-4 h-4 mr-2 animate-spin" />
              {isPending ? 'Confirm in Wallet...' : 'Deploying Token...'}
            </>
          ) : isSuccess ? (
            <>
              <CheckCircle2 className="w-4 h-4 mr-2" />
              Token Launched!
            </>
          ) : (
            'Launch Token'
          )}
        </Button>

        {!isConnected && (
          <div className="flex items-center gap-2 text-amber-600 text-sm">
            <AlertCircle className="w-4 h-4" />
            Please connect your wallet to launch a token
          </div>
        )}
      </form>
    </Card>
  );
}
