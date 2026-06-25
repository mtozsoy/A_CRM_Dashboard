'use client'

import { useState, useEffect } from 'react'
import { Button } from '@/components/ui/button'
import {
  getContacts,
  createContact,
  updateContact,
  deleteContact,
} from '@/app/actions/crm'
import { ContactForm } from '@/components/forms/contact-form'
import { ContactProfilePanel } from './contact-profile-panel'

interface Contact {
  id: number
  userId: string
  firstName: string
  lastName: string
  email?: string | null
  phone?: string | null
  company?: string | null
  jobTitle?: string | null
  industry?: string | null
  notes?: string | null
  status: string
  source?: string | null
  rating: number | null
  createdAt: Date
  updatedAt: Date
}

export function ContactsModule() {
  const [contacts, setContacts] = useState<Contact[]>([])
  const [loading, setLoading] = useState(true)
  const [showForm, setShowForm] = useState(false)
  const [editingId, setEditingId] = useState<number | null>(null)
  const [viewingContactId, setViewingContactId] = useState<number | null>(null)

  useEffect(() => {
    loadContacts()
  }, [])

  async function loadContacts() {
    setLoading(true)
    try {
      const data = await getContacts()
      setContacts(data)
    } catch (error) {
      console.error('Müşteriler yükleme hatası:', error)
    } finally {
      setLoading(false)
    }
  }

  async function handleSubmit(data: any) {
    try {
      if (editingId) {
        await updateContact(editingId, data)
      } else {
        await createContact(data)
      }
      setShowForm(false)
      setEditingId(null)
      loadContacts()
    } catch (error) {
      console.error('Müşteri kaydetme hatası:', error)
    }
  }

  async function handleDelete(id: number) {
    if (confirm('Bu müşteri kaydını silmek istediğinize emin misiniz?')) {
      try {
        await deleteContact(id)
        loadContacts()
      } catch (error) {
        console.error('Müşteri silme hatası:', error)
      }
    }
  }

  const selectedContact = editingId ? contacts.find((c) => c.id === editingId) : null

  return (
    <div className="p-8">
      <div className="max-w-6xl mx-auto">
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-3xl font-bold text-foreground">Müşteriler</h1>
            <p className="text-muted-foreground mt-2">Tüm müşteri ilişkilerinizi yönetin</p>
          </div>
          <Button
            onClick={() => {
              setEditingId(null)
              setShowForm(!showForm)
            }}
          >
            {showForm ? 'İptal' : '+ Yeni Müşteri'}
          </Button>
        </div>

        {showForm && (
          <div className="bg-card border border-border rounded-lg p-6 mb-8">
            <ContactForm
              initialData={selectedContact}
              onSubmit={handleSubmit}
              onCancel={() => {
                setShowForm(false)
                setEditingId(null)
              }}
            />
          </div>
        )}

        {loading ? (
          <div className="text-center py-12">
            <p className="text-muted-foreground">Müşteriler yükleniyor...</p>
          </div>
        ) : contacts.length === 0 ? (
          <div className="text-center py-12 bg-card border border-border rounded-lg">
            <p className="text-muted-foreground mb-4">Henüz müşteri eklenmedi</p>
            <Button onClick={() => setShowForm(true)}>İlk Müşteri&apos;yi Ekle</Button>
          </div>
        ) : (
          <div className="bg-card border border-border rounded-lg overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-border bg-muted/50">
                    <th className="px-6 py-4 text-left text-sm font-semibold text-foreground">
                      Ad
                    </th>
                    <th className="px-6 py-4 text-left text-sm font-semibold text-foreground">
                      E-posta
                    </th>
                    <th className="px-6 py-4 text-left text-sm font-semibold text-foreground">
                      Şirket
                    </th>
                    <th className="px-6 py-4 text-left text-sm font-semibold text-foreground">
                      Statü
                    </th>
                    <th className="px-6 py-4 text-left text-sm font-semibold text-foreground">
                      Rating
                    </th>
                    <th className="px-6 py-4 text-left text-sm font-semibold text-foreground">
                      İşlemler
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {contacts.map((contact) => (
                    <tr 
                      key={contact.id} 
                      className="border-b border-border hover:bg-muted/50 cursor-pointer"
                      onClick={() => setViewingContactId(contact.id)}
                    >
                      <td className="px-6 py-4 text-sm text-foreground whitespace-nowrap">
                        {contact.firstName} {contact.lastName}
                      </td>
                      <td className="px-6 py-4 text-sm text-muted-foreground whitespace-nowrap">{contact.email}</td>
                      <td className="px-6 py-4 text-sm text-muted-foreground whitespace-nowrap">
                        {contact.company || '-'}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span
                          className={`px-3 py-1 rounded-full text-xs font-medium ${
                            contact.status === 'active'
                              ? 'bg-green-100 text-green-800'
                              : 'bg-gray-100 text-gray-800'
                          }`}
                        >
                          {contact.status === 'active' ? 'Aktif' : 'Pasif'}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-sm text-foreground whitespace-nowrap">{contact.rating}/5</td>
                      <td className="px-6 py-4 text-sm whitespace-nowrap">
                        <div className="flex gap-2">
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={(e: React.MouseEvent) => {
                              e.stopPropagation()
                              setEditingId(contact.id)
                              setShowForm(true)
                            }}
                          >
                            Düzenle
                          </Button>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={(e: React.MouseEvent) => {
                              e.stopPropagation()
                              handleDelete(contact.id)
                            }}
                            className="text-destructive hover:text-destructive"
                          >
                            Sil
                          </Button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {viewingContactId && (
          <ContactProfilePanel 
            contactId={viewingContactId} 
            onClose={() => setViewingContactId(null)} 
          />
        )}
      </div>
    </div>
  )
}
