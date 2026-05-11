import { useState } from 'react';
import { CreditCard, Wallet, ShieldCheck } from 'lucide-react';
import { DataTable } from '@/components/common/DataTable';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Checkbox } from '@/components/ui/checkbox';
import { TOP_UP_COLUMNS, MOCK_TOP_UP_RECORDS } from '../constants';

export default function TopUpPage() {
  const [amount, setAmount] = useState('100');
  const [search, setSearch] = useState('');
  const [pageSize, setPageSize] = useState(25);

  const walletBalance = "1,379.03";
  const gatewayCharge = "2.05";
  const totalAmount = (parseFloat(amount || '0') + parseFloat(gatewayCharge)).toFixed(2);

  const savedCards = [
    { id: '1', brand: 'visa', last4: '4242', expiry: '12/26', holder: 'John Doe' },
    { id: '2', brand: 'mastercard', last4: '8888', expiry: '05/25', holder: 'John Doe' },
  ];

  const [selectedCard, setSelectedCard] = useState(savedCards[0].id);

  return (
    <div className="flex flex-col flex-1 gap-4 p-4 h-full overflow-y-auto animate-in fade-in slide-in-from-bottom-2 duration-500 bg-slate-50/30 dark:bg-zinc-950/30 custom-scrollbar">

      <div className="max-w-7xl mx-auto w-full space-y-4 pb-6">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-4 items-start">

          {/* Left Column: Summary & Amount */}
          <div className="lg:col-span-4 space-y-4">
            <div className="bg-white dark:bg-zinc-900 rounded-xl border border-slate-100 dark:border-zinc-800 shadow-sm overflow-hidden">
              <div className="p-4 border-b border-slate-50 dark:border-zinc-800 bg-slate-50/50 dark:bg-zinc-900/50">
                <h2 className="text-[11px] font-black text-slate-800 dark:text-zinc-100 uppercase tracking-widest">Account Summary</h2>
              </div>
              <div className="p-4 space-y-4">
                <div className="p-3 rounded-xl bg-blue-50/50 dark:bg-blue-900/10 border border-blue-100/50 dark:border-blue-900/20 flex flex-col items-center justify-center text-center py-6">
                  <p className="text-[9px] text-slate-400 uppercase tracking-widest font-black mb-1">Available Balance</p>
                  <p className="text-3xl font-black text-blue-600 dark:text-blue-400">${walletBalance}</p>
                </div>

                <div className="space-y-3">
                  <div className="flex items-center gap-2">
                    <span className="h-1.5 w-1.5 rounded-full bg-blue-600"></span>
                    <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest">Enter Amount</label>
                  </div>
                  <div className="relative group">
                    <div className="absolute left-3.5 top-1/2 -translate-y-1/2">
                      <span className="text-base font-bold text-slate-400">$</span>
                    </div>
                    <Input
                      type="number"
                      value={amount}
                      onChange={(e) => setAmount(e.target.value)}
                      className="pl-9 h-10 text-xl font-bold border-slate-200 dark:border-zinc-800 focus-visible:border-blue-500 rounded-lg transition-all bg-white dark:bg-zinc-950"
                      placeholder="0.00"
                    />
                  </div>
                  <div className="p-2.5 rounded-lg bg-slate-50 dark:bg-zinc-800/50 border border-slate-100 dark:border-zinc-800">
                    <p className="text-slate-500 dark:text-zinc-400 text-[9px] flex items-center gap-2 font-bold leading-relaxed">
                      <ShieldCheck className="h-3 w-3 text-blue-600" />
                      Gateway fee of ${gatewayCharge} will be added.
                    </p>
                  </div>
                </div>
              </div>
            </div>

            <div className="bg-blue-600 rounded-xl p-5 text-white shadow-lg shadow-blue-500/20 relative overflow-hidden group">
              <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full -mr-16 -mt-16 blur-2xl group-hover:scale-110 transition-transform duration-700"></div>
              <div className="relative">
                <p className="text-[9px] font-black uppercase tracking-widest opacity-80">Total to Pay</p>
                <p className="text-2xl font-black mt-0.5">${totalAmount}</p>
                <p className="text-[9px] mt-3 opacity-70 font-medium italic">Instant wallet credit</p>
              </div>
            </div>
          </div>

          {/* Right Column: Payment Methods */}
          <div className="lg:col-span-8 space-y-4">
            <div className="bg-white dark:bg-zinc-900 rounded-xl border border-slate-100 dark:border-zinc-800 shadow-sm overflow-hidden h-full">
              <div className="p-4 border-b border-slate-50 dark:border-zinc-800 flex justify-between items-center bg-slate-50/50 dark:bg-zinc-900/50">
                <h2 className="text-[11px] font-black text-slate-800 dark:text-zinc-100 uppercase tracking-widest">Payment Details</h2>
                <div className="flex gap-2">
                  <div className="h-1.5 w-1.5 rounded-full bg-emerald-500 animate-pulse mt-0.5"></div>
                  <span className="text-[9px] font-bold text-emerald-600 uppercase tracking-widest">Secure Connection</span>
                </div>
              </div>

              <div className="p-6 space-y-6">
                <div className="space-y-3">
                  <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest">Saved Methods</p>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                    {savedCards.map((card) => (
                      <div
                        key={card.id}
                        onClick={() => setSelectedCard(card.id)}
                        className={`relative p-4 rounded-xl border-2 transition-all cursor-pointer group ${selectedCard === card.id
                          ? 'border-blue-500 bg-blue-50/10'
                          : 'border-slate-50 dark:border-zinc-800 bg-white dark:bg-zinc-950 hover:border-slate-200 dark:hover:border-zinc-700'
                          }`}
                      >
                        <div className="flex justify-between items-center mb-4">
                          <div className="h-5 px-2 rounded bg-white dark:bg-zinc-800 border border-slate-100 dark:border-zinc-700 flex items-center justify-center shadow-xs">
                            {card.brand === 'visa' ? (
                              <span className="font-black italic text-[9px] text-blue-800 dark:text-blue-400">VISA</span>
                            ) : (
                              <div className="flex scale-[0.4]">
                                <div className="h-6 w-6 rounded-full bg-red-500"></div>
                                <div className="h-6 w-6 rounded-full bg-amber-500 -ml-3"></div>
                              </div>
                            )}
                          </div>
                          <div className={`h-3.5 w-3.5 rounded-full border-2 flex items-center justify-center transition-all ${selectedCard === card.id ? 'bg-blue-600 border-blue-600' : 'border-slate-200 dark:border-zinc-800'
                            }`}>
                            {selectedCard === card.id && <ShieldCheck className="h-2 w-2 text-white" />}
                          </div>
                        </div>

                        <div>
                          <p className={`text-xs font-mono font-bold tracking-widest ${selectedCard === card.id ? 'text-blue-900 dark:text-blue-300' : 'text-slate-600 dark:text-zinc-400'}`}>
                            ••••  ••••  ••••  {card.last4}
                          </p>
                          <div className="flex justify-between items-end mt-3">
                            <p className="text-[8px] font-black text-slate-400 uppercase tracking-tighter">{card.holder}</p>
                            <p className="text-[8px] font-black text-slate-400 uppercase tracking-tighter">{card.expiry}</p>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="space-y-4 pt-4 border-t border-slate-50 dark:border-zinc-800">
                  <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest">Add New Card</p>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-x-4 gap-y-3">
                    <div className="space-y-1">
                      <label className="text-[9px] font-black text-slate-500 uppercase tracking-widest ml-1">Card Holder Name</label>
                      <Input placeholder="Enter full name" className="h-9 text-[11px] rounded-lg bg-slate-50/50 dark:bg-zinc-950 border-slate-100 dark:border-zinc-800 focus-visible:bg-white dark:focus-visible:bg-zinc-900" />
                    </div>
                    <div className="space-y-1">
                      <label className="text-[9px] font-black text-slate-500 uppercase tracking-widest ml-1">Card Number</label>
                      <div className="relative">
                        <CreditCard className="absolute left-3 top-1/2 -translate-y-1/2 h-3 w-3 text-slate-400" />
                        <Input placeholder="0000 0000 0000 0000" className="pl-8.5 h-9 text-[11px] rounded-lg bg-slate-50/50 dark:bg-zinc-950 border-slate-100 dark:border-zinc-800 focus-visible:bg-white dark:focus-visible:bg-zinc-900" />
                      </div>
                    </div>
                    <div className="space-y-1">
                      <label className="text-[9px] font-black text-slate-500 uppercase tracking-widest ml-1">Expiry Date</label>
                      <Input placeholder="MM / YY" className="h-9 text-[11px] rounded-lg bg-slate-50/50 dark:bg-zinc-950 border-slate-100 dark:border-zinc-800 focus-visible:bg-white dark:focus-visible:bg-zinc-900" />
                    </div>
                    <div className="space-y-1">
                      <label className="text-[9px] font-black text-slate-500 uppercase tracking-widest ml-1">Security Code (CVC)</label>
                      <Input placeholder="123" className="h-9 text-[11px] rounded-lg bg-slate-50/50 dark:bg-zinc-950 border-slate-100 dark:border-zinc-800 focus-visible:bg-white dark:focus-visible:bg-zinc-900" />
                    </div>
                  </div>

                  <div className="flex items-center space-x-2 py-1.5 px-2.5 rounded-lg bg-slate-50 dark:bg-zinc-800/50 w-fit">
                    <Checkbox id="save-card" className="h-3.5 w-3.5 border-slate-300" />
                    <label htmlFor="save-card" className="text-[9px] text-slate-500 cursor-pointer font-black uppercase tracking-widest select-none">
                      Save for future use
                    </label>
                  </div>

                  <div className="pt-2">
                    <Button
                      className="w-full h-10 text-[10px] font-black bg-blue-600 hover:bg-blue-700 text-white rounded-xl transition-all flex items-center justify-center gap-2 shadow-lg shadow-blue-500/10 group"
                    >
                      <Wallet className="h-3.5 w-3.5 group-hover:scale-110 transition-transform" />
                      Complete Top Up - ${totalAmount}
                    </Button>
                    <div className="mt-4 flex justify-center items-center gap-4 opacity-30 grayscale">
                      <span className="text-[8px] font-black italic tracking-[0.2em]">VISA</span>
                      <div className="h-2.5 w-px bg-slate-300 dark:bg-zinc-700"></div>
                      <div className="flex gap-1">
                        <div className="h-3 w-3 rounded-full bg-slate-400"></div>
                        <div className="h-3 w-3 rounded-full bg-slate-400 -ml-2"></div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom Section: Transaction History */}
        <div className="bg-white dark:bg-zinc-900 rounded-xl border border-slate-100 dark:border-zinc-800 shadow-sm overflow-hidden">
          <DataTable
            columns={TOP_UP_COLUMNS as any}
            data={MOCK_TOP_UP_RECORDS}
            headerTitle="Recent Top Up Transactions"
            searchable
            searchValue={search}
            onSearchChange={setSearch}
            pageSize={pageSize}
            onPageSizeChange={(val) => setPageSize(Number(val))}
            className="pb-2"
            totalItems={MOCK_TOP_UP_RECORDS.length}
          />
        </div>
      </div>
    </div>





  );
}
