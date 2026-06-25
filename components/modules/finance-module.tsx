'use client'

import { useState, useEffect } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Wallet, TrendingUp, TrendingDown, Plus, CreditCard, Landmark, DollarSign, Trash2 } from 'lucide-react'
import { getAccounts, getTransactions, createAccount, createTransaction, deleteTransaction } from '@/app/actions/finance'

// Types
type Account = { id: number, name: string, type: string, currency: string, initialBalance: string }
type Transaction = { id: number, accountId: number, type: string, amount: string, category: string, description: string | null, date: Date }

export function FinanceModule() {
  const [accounts, setAccounts] = useState<Account[]>([])
  const [transactions, setTransactions] = useState<Transaction[]>([])
  const [loading, setLoading] = useState(true)

  // Forms
  const [showAccountForm, setShowAccountForm] = useState(false)
  const [showTxForm, setShowTxForm] = useState(false)
  const [baseCurrency, setBaseCurrency] = useState('TRY')

  const [accountForm, setAccountForm] = useState({ name: '', type: 'bank', currency: 'TRY', initialBalance: '0' })
  const [txForm, setTxForm] = useState({ accountId: '', type: 'income', amount: '', category: '', description: '', date: new Date().toISOString().split('T')[0] })

  useEffect(() => {
    loadData()
  }, [])

  async function loadData() {
    setLoading(true)
    try {
      const [accs, txs] = await Promise.all([getAccounts(), getTransactions()])
      setAccounts(accs as any)
      setTransactions(txs as any)
    } catch (err) {
      console.error(err)
    } finally {
      setLoading(false)
    }
  }

  const EXCHANGE_RATES: Record<string, number> = {
    TRY: 1,
    USD: 33.5,
    EUR: 36.2
  }

  // Calculated metrics
  const totalAssetsBase = accounts.reduce((sum, acc) => {
    let bal = parseFloat(acc.initialBalance || '0')
    const accTxs = transactions.filter(t => t.accountId === acc.id)
    accTxs.forEach(t => {
      if (t.type === 'income') bal += parseFloat(t.amount)
      if (t.type === 'expense') bal -= parseFloat(t.amount)
    })
    
    const balInTry = acc.currency === 'TRY' ? bal : bal * (EXCHANGE_RATES[acc.currency] || 1)
    const balInBase = baseCurrency === 'TRY' ? balInTry : balInTry / (EXCHANGE_RATES[baseCurrency] || 1)
    return sum + balInBase
  }, 0)

  const incomeTxs = transactions.filter(t => t.type === 'income')
  const totalIncomeBase = incomeTxs.reduce((sum, t) => {
    const acc = accounts.find(a => a.id === t.accountId)
    const amount = parseFloat(t.amount)
    const amountInTry = acc?.currency === 'TRY' ? amount : amount * (EXCHANGE_RATES[acc?.currency || 'TRY'] || 1)
    const amountInBase = baseCurrency === 'TRY' ? amountInTry : amountInTry / (EXCHANGE_RATES[baseCurrency] || 1)
    return sum + amountInBase
  }, 0)

  const expenseTxs = transactions.filter(t => t.type === 'expense')
  const totalExpenseBase = expenseTxs.reduce((sum, t) => {
    const acc = accounts.find(a => a.id === t.accountId)
    const amount = parseFloat(t.amount)
    const amountInTry = acc?.currency === 'TRY' ? amount : amount * (EXCHANGE_RATES[acc?.currency || 'TRY'] || 1)
    const amountInBase = baseCurrency === 'TRY' ? amountInTry : amountInTry / (EXCHANGE_RATES[baseCurrency] || 1)
    return sum + amountInBase
  }, 0)

  async function handleAddAccount(e: React.FormEvent) {
    e.preventDefault()
    await createAccount(accountForm)
    setShowAccountForm(false)
    setAccountForm({ name: '', type: 'bank', currency: 'TRY', initialBalance: '0' })
    loadData()
  }

  async function handleAddTransaction(e: React.FormEvent) {
    e.preventDefault()
    if (!txForm.accountId) return alert('Lütfen bir hesap seçin')
    await createTransaction({
      ...txForm,
      accountId: parseInt(txForm.accountId),
      date: new Date(txForm.date)
    })
    setShowTxForm(false)
    setTxForm({ accountId: '', type: 'income', amount: '', category: '', description: '', date: new Date().toISOString().split('T')[0] })
    loadData()
  }

  async function handleDeleteTx(id: number) {
    if(confirm('İşlemi silmek istediğinize emin misiniz?')) {
      await deleteTransaction(id)
      loadData()
    }
  }

  const getAccountIcon = (type: string) => {
    if (type === 'cash') return <DollarSign className="w-5 h-5" />
    if (type === 'credit_card') return <CreditCard className="w-5 h-5" />
    return <Landmark className="w-5 h-5" />
  }

  return (
    <div className="p-8 max-w-7xl mx-auto space-y-8">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-3xl font-bold tracking-tight">Finans & Kasa Yönetimi</h2>
          <p className="text-muted-foreground mt-2">Şirketinizin nakit akışını, gelir ve giderlerini takip edin.</p>
        </div>
        <div className="flex gap-4">
          <Button onClick={() => setShowAccountForm(true)} variant="outline">
            <Plus className="w-4 h-4 mr-2" />
            Yeni Kasa/Banka
          </Button>
          <Button onClick={() => setShowTxForm(true)}>
            <Plus className="w-4 h-4 mr-2" />
            Gelir/Gider Ekle
          </Button>
        </div>
      </div>

      <div className="grid gap-6 md:grid-cols-3">
        <Card className="bg-gradient-to-br from-card to-card border-border shadow-sm">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground flex items-center gap-2">
              Toplam Varlıklar
              <select className="bg-background border border-border rounded px-1 py-0.5 text-xs text-foreground" value={baseCurrency} onChange={e => setBaseCurrency(e.target.value)}>
                <option value="TRY">TRY</option>
                <option value="USD">USD</option>
                <option value="EUR">EUR</option>
              </select>
            </CardTitle>
            <Wallet className="h-4 w-4 text-primary" />
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">{new Intl.NumberFormat('tr-TR').format(totalAssetsBase)} {baseCurrency === 'TRY' ? '₺' : baseCurrency === 'USD' ? '$' : '€'}</div>
            <p className="text-xs text-muted-foreground mt-1">Tüm hesapların güncel bakiyesi</p>
          </CardContent>
        </Card>
        <Card className="bg-gradient-to-br from-card to-card border-border shadow-sm">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Toplam Gelir</CardTitle>
            <TrendingUp className="h-4 w-4 text-emerald-500" />
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-emerald-500">{new Intl.NumberFormat('tr-TR').format(totalIncomeBase)} {baseCurrency === 'TRY' ? '₺' : baseCurrency === 'USD' ? '$' : '€'}</div>
            <p className="text-xs text-muted-foreground mt-1">Kaydedilen tüm gelirler</p>
          </CardContent>
        </Card>
        <Card className="bg-gradient-to-br from-card to-card border-border shadow-sm">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Toplam Gider</CardTitle>
            <TrendingDown className="h-4 w-4 text-red-500" />
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-red-500">{new Intl.NumberFormat('tr-TR').format(totalExpenseBase)} {baseCurrency === 'TRY' ? '₺' : baseCurrency === 'USD' ? '$' : '€'}</div>
            <p className="text-xs text-muted-foreground mt-1">Kaydedilen tüm giderler</p>
          </CardContent>
        </Card>
      </div>

      {showAccountForm && (
        <Card className="mb-8 border-primary/20">
          <CardHeader>
            <CardTitle>Yeni Hesap (Kasa/Banka) Ekle</CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleAddAccount} className="grid grid-cols-1 md:grid-cols-5 gap-4 items-end">
              <div className="space-y-2">
                <Label>Hesap Adı</Label>
                <Input required value={accountForm.name} onChange={e => setAccountForm({...accountForm, name: e.target.value})} placeholder="Örn: Garanti BBVA Ticari" />
              </div>
              <div className="space-y-2">
                <Label>Tür</Label>
                <select className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm" value={accountForm.type} onChange={e => setAccountForm({...accountForm, type: e.target.value})}>
                  <option value="bank">Banka Hesabı</option>
                  <option value="cash">Nakit Kasa</option>
                  <option value="credit_card">Kredi Kartı</option>
                </select>
              </div>
              <div className="space-y-2">
                <Label>Para Birimi</Label>
                <select className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm" value={accountForm.currency} onChange={e => setAccountForm({...accountForm, currency: e.target.value})}>
                  <option value="TRY">TRY</option>
                  <option value="USD">USD</option>
                  <option value="EUR">EUR</option>
                </select>
              </div>
              <div className="space-y-2">
                <Label>Açılış Bakiyesi</Label>
                <Input required type="number" step="0.01" value={accountForm.initialBalance} onChange={e => setAccountForm({...accountForm, initialBalance: e.target.value})} />
              </div>
              <div className="flex gap-2">
                <Button type="button" variant="outline" onClick={() => setShowAccountForm(false)} className="w-full">İptal</Button>
                <Button type="submit" className="w-full">Kaydet</Button>
              </div>
            </form>
          </CardContent>
        </Card>
      )}

      {showTxForm && (
        <Card className="mb-8 border-primary/20">
          <CardHeader>
            <CardTitle>Yeni İşlem Ekle</CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleAddTransaction} className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-6 gap-4 items-end">
              <div className="space-y-2 lg:col-span-1">
                <Label>İşlem Türü</Label>
                <select className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm" value={txForm.type} onChange={e => setTxForm({...txForm, type: e.target.value})}>
                  <option value="income">Gelir (+)</option>
                  <option value="expense">Gider (-)</option>
                </select>
              </div>
              <div className="space-y-2 lg:col-span-1">
                <Label>Hesap</Label>
                <select required className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm" value={txForm.accountId} onChange={e => setTxForm({...txForm, accountId: e.target.value})}>
                  <option value="">Seçiniz...</option>
                  {accounts.map(a => <option key={a.id} value={a.id}>{a.name}</option>)}
                </select>
              </div>
              <div className="space-y-2 lg:col-span-1">
                <Label>Tutar</Label>
                <Input required type="number" step="0.01" value={txForm.amount} onChange={e => setTxForm({...txForm, amount: e.target.value})} />
              </div>
              <div className="space-y-2 lg:col-span-1">
                <Label>Kategori</Label>
                <Input required value={txForm.category} onChange={e => setTxForm({...txForm, category: e.target.value})} placeholder="Örn: Maaşlar, Satış" />
              </div>
              <div className="space-y-2 lg:col-span-1">
                <Label>Açıklama</Label>
                <Input value={txForm.description} onChange={e => setTxForm({...txForm, description: e.target.value})} />
              </div>
              <div className="flex gap-2 lg:col-span-1">
                <Button type="button" variant="outline" onClick={() => setShowTxForm(false)} className="w-full">İptal</Button>
                <Button type="submit" className="w-full">Kaydet</Button>
              </div>
            </form>
          </CardContent>
        </Card>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="space-y-6">
          <h3 className="text-xl font-semibold">Hesaplar</h3>
          {accounts.map(acc => {
            let currentBal = parseFloat(acc.initialBalance || '0')
            transactions.filter(t => t.accountId === acc.id).forEach(t => {
              if (t.type === 'income') currentBal += parseFloat(t.amount)
              if (t.type === 'expense') currentBal -= parseFloat(t.amount)
            })
            
            return (
              <Card key={acc.id} className="bg-card">
                <CardContent className="p-6 flex items-center justify-between">
                  <div className="flex items-center gap-4">
                    <div className="p-3 bg-primary/10 rounded-xl text-primary">
                      {getAccountIcon(acc.type)}
                    </div>
                    <div>
                      <h4 className="font-semibold text-lg">{acc.name}</h4>
                      <p className="text-sm text-muted-foreground capitalize">{acc.type}</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="font-bold text-xl">{new Intl.NumberFormat('tr-TR').format(currentBal)} {acc.currency}</div>
                  </div>
                </CardContent>
              </Card>
            )
          })}
          {accounts.length === 0 && !loading && (
            <div className="text-center p-8 text-muted-foreground border rounded-xl border-dashed">
              Henüz hesap eklenmemiş.
            </div>
          )}
        </div>

        <div className="lg:col-span-2 space-y-6">
          <h3 className="text-xl font-semibold">Son İşlemler</h3>
          <div className="border rounded-xl bg-card overflow-hidden">
            <table className="w-full text-sm text-left">
              <thead className="text-xs uppercase bg-muted/50 border-b">
                <tr>
                  <th className="px-6 py-4 font-semibold">Tarih</th>
                  <th className="px-6 py-4 font-semibold">İşlem / Kategori</th>
                  <th className="px-6 py-4 font-semibold">Hesap</th>
                  <th className="px-6 py-4 font-semibold text-right">Tutar</th>
                  <th className="px-6 py-4 font-semibold text-right">İşlem</th>
                </tr>
              </thead>
              <tbody>
                {transactions.map(tx => {
                  const acc = accounts.find(a => a.id === tx.accountId)
                  const isIncome = tx.type === 'income'
                  return (
                    <tr key={tx.id} className="border-b last:border-0 hover:bg-muted/50 transition-colors">
                      <td className="px-6 py-4 text-muted-foreground">
                        {new Date(tx.date).toLocaleDateString('tr-TR')}
                      </td>
                      <td className="px-6 py-4">
                        <div className="font-medium text-foreground">{tx.category}</div>
                        <div className="text-xs text-muted-foreground truncate max-w-[200px]">{tx.description}</div>
                      </td>
                      <td className="px-6 py-4">
                        <span className="bg-secondary px-2 py-1 rounded-md text-xs">{acc?.name}</span>
                      </td>
                      <td className={`px-6 py-4 font-bold text-right ${isIncome ? 'text-emerald-500' : 'text-red-500'}`}>
                        {isIncome ? '+' : '-'}{new Intl.NumberFormat('tr-TR').format(parseFloat(tx.amount))} ₺
                      </td>
                      <td className="px-6 py-4 text-right">
                        <Button variant="ghost" size="icon" onClick={() => handleDeleteTx(tx.id)} className="text-muted-foreground hover:text-red-500 hover:bg-red-500/10 h-8 w-8">
                          <Trash2 className="w-4 h-4" />
                        </Button>
                      </td>
                    </tr>
                  )
                })}
                {transactions.length === 0 && !loading && (
                  <tr>
                    <td colSpan={5} className="px-6 py-12 text-center text-muted-foreground">
                      Herhangi bir finansal işlem bulunamadı.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  )
}
