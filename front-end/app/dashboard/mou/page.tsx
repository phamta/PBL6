'use client'

import { useEffect, useState } from 'react'
import { mouAPI } from '@/lib/api-client'
import { MOU, FormEvent, InputChangeEvent } from '@/types'

interface MOUFormData {
  title: string
  partnerOrganization: string
  partnerCountry: string
  description: string
  signedDate: string
  expiryDate: string
  terms: string
}

export default function MOUPage() {
  const [mous, setMous] = useState<MOU[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [formData, setFormData] = useState<MOUFormData>({
    title: '',
    partnerOrganization: '',
    partnerCountry: '',
    description: '',
    signedDate: '',
    expiryDate: '',
    terms: ''
  })

  useEffect(() => {
    fetchMOUs()
  }, [])

  const fetchMOUs = async () => {
    try {
      const response = await mouAPI.getMOUs()
      setMous(response.data)
    } catch (error) {
      console.error('Error fetching MOUs:', error)
    } finally {
      setIsLoading(false)
    }
  }

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault()
    try {
      await mouAPI.createMOU(formData)
      setIsModalOpen(false)
      setFormData({
        title: '',
        partnerOrganization: '',
        partnerCountry: '',
        description: '',
        signedDate: '',
        expiryDate: '',
        terms: ''
      })
      fetchMOUs() // Refresh list
    } catch (error) {
      console.error('Error creating MOU:', error)
    }
  }

  const handleInputChange = (e: InputChangeEvent) => {
    const { name, value } = e.target
    setFormData(prev => ({
      ...prev,
      [name]: value
    }))
  }

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600"></div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold text-gray-900">Quản lý MOU</h1>
        <button
          onClick={() => setIsModalOpen(true)}
          className="bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2 rounded-md font-medium"
        >
          Thêm MOU mới
        </button>
      </div>

      {/* MOUs Table */}
      <div className="bg-white shadow overflow-hidden sm:rounded-md">
        <ul className="divide-y divide-gray-200">
          {mous.length === 0 ? (
            <li className="px-6 py-4 text-center text-gray-500">
              Chưa có MOU nào được tạo
            </li>
          ) : (
            mous.map((mou) => (
              <li key={mou.id} className="px-6 py-4 hover:bg-gray-50">
                <div className="flex items-center justify-between">
                  <div className="flex-1">
                    <h3 className="text-lg font-medium text-gray-900">{mou.title}</h3>
                    <p className="text-sm text-gray-600">{mou.partnerOrganization} - {mou.partnerCountry}</p>
                    <div className="mt-2 flex space-x-4 text-sm text-gray-500">
                      <span>Ký: {mou.signedDate ? new Date(mou.signedDate).toLocaleDateString('vi-VN') : 'Chưa ký'}</span>
                      <span>Hết hạn: {mou.expiryDate ? new Date(mou.expiryDate).toLocaleDateString('vi-VN') : 'Chưa xác định'}</span>
                      <span className={`px-2 py-1 rounded-full text-xs ${
                        mou.status === 'active' ? 'bg-green-100 text-green-800' :
                        mou.status === 'expired' ? 'bg-red-100 text-red-800' :
                        'bg-yellow-100 text-yellow-800'
                      }`}>
                        {mou.status}
                      </span>
                    </div>
                  </div>
                  <div className="flex space-x-2">
                    <button className="text-indigo-600 hover:text-indigo-900 text-sm font-medium">
                      Xem
                    </button>
                    <button className="text-indigo-600 hover:text-indigo-900 text-sm font-medium">
                      Sửa
                    </button>
                  </div>
                </div>
              </li>
            ))
          )}
        </ul>
      </div>

      {/* Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg max-w-2xl w-full max-h-screen overflow-y-auto">
            <div className="p-6">
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-xl font-bold text-gray-900">Thêm MOU mới</h2>
                <button
                  onClick={() => setIsModalOpen(false)}
                  className="text-gray-400 hover:text-gray-600"
                >
                  ✕
                </button>
              </div>

              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Tiêu đề
                  </label>
                  <input
                    type="text"
                    name="title"
                    value={formData.title}
                    onChange={handleInputChange}
                    required
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Tổ chức đối tác
                  </label>
                  <input
                    type="text"
                    name="partnerOrganization"
                    value={formData.partnerOrganization}
                    onChange={handleInputChange}
                    required
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Quốc gia
                  </label>
                  <input
                    type="text"
                    name="partnerCountry"
                    value={formData.partnerCountry}
                    onChange={handleInputChange}
                    required
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Mô tả
                  </label>
                  <textarea
                    name="description"
                    value={formData.description}
                    onChange={handleInputChange}
                    rows={3}
                    required
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Ngày ký
                    </label>
                    <input
                      type="date"
                      name="signedDate"
                      value={formData.signedDate}
                      onChange={handleInputChange}
                      required
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Ngày hết hạn
                    </label>
                    <input
                      type="date"
                      name="expiryDate"
                      value={formData.expiryDate}
                      onChange={handleInputChange}
                      required
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Điều khoản
                  </label>
                  <textarea
                    name="terms"
                    value={formData.terms}
                    onChange={handleInputChange}
                    rows={4}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                  />
                </div>

                <div className="flex justify-end space-x-3 pt-4">
                  <button
                    type="button"
                    onClick={() => setIsModalOpen(false)}
                    className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50"
                  >
                    Hủy
                  </button>
                  <button
                    type="submit"
                    className="px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700"
                  >
                    Tạo MOU
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
