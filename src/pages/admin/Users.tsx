import React, { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { User, UserStatus, Certification } from '../../types';
import { DataTable } from '../../components/DataTable';
import { Plus, UserCircle, Building2, Key, Award } from 'lucide-react';
import api from '../../api/config';
import { Alert } from '../../components/ui/Alert';
import { Button } from '../../components/ui/Button';
import { SearchBar } from '../../components/SearchBar';
import { Modal } from '../../components/ui/Modal';
import { Tabs } from '../../components/ui/Tabs';
import { MUNICIPALITIES } from '../../utils/municipalities';

const CERTIFICATION_OPTIONS = [
 { value: 'FAIRTRADE_USA', label: 'Fairtrade USA' },
 { value: 'GLOBAL_GAP', label: 'Global GAP' },
 { value: 'ICA', label: 'ICA' }
];

type TabType = 'personal' | 'ubicacion' | 'acceso' | 'certificaciones';

export const Users: React.FC = () => {
 const [users, setUsers] = useState<User[]>([]);
 const [filteredUsers, setFilteredUsers] = useState<User[]>([]);
 const [showModal, setShowModal] = useState(false);
 const [editingUser, setEditingUser] = useState<User | null>(null);
 const [error, setError] = useState<string | null>(null);
 const [loading, setLoading] = useState(false);
 const [searchTerm, setSearchTerm] = useState('');
 const [activeTab, setActiveTab] = useState<TabType>('personal');

 const { register, handleSubmit, reset, formState: { errors }, setValue, watch } = useForm<User>();
 const selectedCertifications = watch('certifications') || [];

 useEffect(() => {
   fetchUsers();
 }, []);

 useEffect(() => {
   filterUsers();
 }, [searchTerm, users]);

 const filterUsers = () => {
   if (!searchTerm.trim()) {
     setFilteredUsers(users);
     return;
   }

   const searchTermLower = searchTerm.toLowerCase();
   const filtered = users.filter(user => 
     user.cedula.toLowerCase().includes(searchTermLower) ||
     user.nombreCompleto.toLowerCase().includes(searchTermLower) ||
     user.codigoTrazabilidad.toLowerCase().includes(searchTermLower) ||
     user.municipio.toLowerCase().includes(searchTermLower) ||
     user.telefono.toLowerCase().includes(searchTermLower) ||
     user.usuario.toLowerCase().includes(searchTermLower)
   );
   setFilteredUsers(filtered);
 };

 const fetchUsers = async () => {
   try {
     setLoading(true);
     const response = await api.get('/users');
     if (response.data.success) {
       setUsers(response.data.data);
       setFilteredUsers(response.data.data);
     } else {
       setError(response.data.message || 'Error al cargar usuarios');
     }
   } catch (error: any) {
     console.error('Error al cargar usuarios:', error);
     setError(error.response?.data?.message || 'Error al cargar usuarios');
   } finally {
     setLoading(false);
   }
 };

 const onSubmit = async (data: User) => {
   try {
     setLoading(true);
     const userData = {
       ...data,
       certifications: Array.isArray(data.certifications) ? data.certifications : [],
     };
     
     const url = editingUser ? `/users/${editingUser.id}` : '/users';
     const method = editingUser ? 'put' : 'post';
     
     const response = await api[method](url, userData);
     
     if (response.data.success) {
       await fetchUsers();
       setShowModal(false);
       setEditingUser(null);
       reset();
     } else {
       setError(response.data.message);
     }
   } catch (error: any) {
     console.error('Error al guardar usuario:', error);
     setError(error.response?.data?.message || 'Error al guardar usuario');
   } finally {
     setLoading(false);
   }
 };

 const handleEdit = (user: User) => {
   setEditingUser(user);
   reset({
     ...user,
     certifications: user.certifications || []
   });
   setShowModal(true);
   setActiveTab('personal');
 };

 const handleDelete = async (user: User) => {
   if (window.confirm('¿Está seguro de eliminar este usuario?')) {
     try {
       setLoading(true);
       const response = await api.delete(`/users/${user.id}`);
       if (response.data.success) {
         fetchUsers();
       } else {
         setError(response.data.message);
       }
     } catch (error: any) {
       console.error('Error al eliminar usuario:', error);
       setError(error.response?.data?.message || 'Error al eliminar usuario');
     } finally {
       setLoading(false);
     }
   }
 };

 const handleCertificationChange = (cert: Certification) => {
   const current = selectedCertifications || [];
   const updated = current.includes(cert)
     ? current.filter(c => c !== cert)
     : [...current, cert];
   setValue('certifications', updated);
 };

 const tabs = [
   { id: 'personal', label: 'Datos Personales', icon: UserCircle },
   { id: 'ubicacion', label: 'Ubicación', icon: Building2 },
   { id: 'acceso', label: 'Acceso', icon: Key },
   { id: 'certificaciones', label: 'Certificaciones', icon: Award }
 ];

 const columns = [
   { key: 'cedula', label: 'Cédula' },
   { key: 'nombreCompleto', label: 'Nombre Completo' },
   { key: 'codigoTrazabilidad', label: 'Código Trazabilidad' },
   { key: 'municipio', label: 'Municipio' },
   { key: 'telefono', label: 'Teléfono' },
   { key: 'usuario', label: 'Usuario' },
   { key: 'role', label: 'Rol' },
   { 
     key: 'status', 
     label: 'Estado',
     render: (value: UserStatus) => value === 'ACTIVO' ? 
       <span className="text-green-600 font-medium">Activo</span> : 
       <span className="text-red-600 font-medium">Inactivo</span>
   },
   {
     key: 'certifications',
     label: 'Certificaciones',
     render: (certifications: Certification[]) => (
       <div className="flex flex-wrap gap-1">
         {certifications?.map(cert => (
           <span key={cert} className="px-2 py-1 bg-blue-100 text-blue-800 text-xs rounded-full">
             {CERTIFICATION_OPTIONS.find(opt => opt.value === cert)?.label}
           </span>
         ))}
       </div>
     )
   }
 ];

 return (
   <div className="space-y-6">
     {error && (
       <Alert 
         type="error" 
         message={error} 
         onClose={() => setError(null)}
       />
     )}

     <div className="flex justify-between items-center">
       <h1 className="text-2xl font-bold">Gestión de Usuarios</h1>
       <Button
         onClick={() => {
           setEditingUser(null);
           reset({
             certifications: [],
             status: 'ACTIVO' as UserStatus
           });
           setShowModal(true);
           setActiveTab('personal');
         }}
         variant="primary"
         icon={Plus}
         disabled={loading}
       >
         Nuevo Usuario
       </Button>
     </div>

     <SearchBar
       value={searchTerm}
       onChange={setSearchTerm}
       placeholder="Buscar usuarios..."
     />

     <DataTable
       columns={columns}
       data={filteredUsers}
       onEdit={handleEdit}
       onDelete={handleDelete}
       loading={loading}
     />

     <Modal
       isOpen={showModal}
       onClose={() => setShowModal(false)}
       title={editingUser ? 'Editar Usuario' : 'Nuevo Usuario'}
       size="full"
     >
       <div className="flex flex-col h-full">
         <Tabs
           tabs={tabs}
           activeTab={activeTab}
           onTabChange={(id) => setActiveTab(id as TabType)}
         />

         <form onSubmit={handleSubmit(onSubmit)} className="flex-1 overflow-auto p-6">
           <div className={activeTab === 'personal' ? 'block' : 'hidden'}>
             <div className="grid grid-cols-2 gap-4">
               <div>
                 <label className="block text-sm font-medium text-gray-700">Cédula</label>
                 <input
                   type="text"
                   {...register('cedula', { 
                     required: 'La cédula es requerida',
                     pattern: {
                       value: /^\d{7,10}$/,
                       message: 'La cédula debe tener entre 7 y 10 dígitos'
                     }
                   })}
                   className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-green-500 focus:ring focus:ring-green-200"
                   disabled={loading}
                 />
                 {errors.cedula && (
                   <span className="text-red-500 text-sm">{errors.cedula.message}</span>
                 )}
               </div>

               <div>
                 <label className="block text-sm font-medium text-gray-700">Nombre Completo</label>
                 <input
                   type="text"
                   {...register('nombreCompleto', { required: 'El nombre completo es requerido' })}
                   className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-green-500 focus:ring focus:ring-green-200"
                   disabled={loading}
                 />
                 {errors.nombreCompleto && (
                   <span className="text-red-500 text-sm">{errors.nombreCompleto.message}</span>
                 )}
               </div>

               <div>
                 <label className="block text-sm font-medium text-gray-700">Código Trazabilidad</label>
                 <input
                   type="text"
                   {...register('codigoTrazabilidad', { required: 'El código de trazabilidad es requerido' })}
                   className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-green-500 focus:ring focus:ring-green-200"
                   disabled={loading}
                 />
                 {errors.codigoTrazabilidad && (
                   <span className="text-red-500 text-sm">{errors.codigoTrazabilidad.message}</span>
                 )}
               </div>
             </div>
           </div>

           <div className={activeTab === 'ubicacion' ? 'block' : 'hidden'}>
             <div className="grid grid-cols-2 gap-4">
               <div>
                 <label className="block text-sm font-medium text-gray-700">Municipio</label>
                 <select
                   {...register('municipio', { required: 'El municipio es requerido' })}
                   className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-green-500 focus:ring focus:ring-green-200"
                   disabled={loading}
                 >
                   <option value="">Seleccione un municipio</option>
                   {MUNICIPALITIES.map(municipio => (
                     <option key={municipio} value={municipio}>
                       {municipio}
                     </option>
                   ))}
                 </select>
                 {errors.municipio && (
                   <span className="text-red-500 text-sm">{errors.municipio.message}</span>
                 )}
               </div>

               <div>
                 <label className="block text-sm font-medium text-gray-700">Teléfono</label>
                 <input
                   type="text"
                   {...register('telefono', {
                     required: 'El teléfono es requerido',
                     pattern: {
                       value: /^\d{10}$/,
                       message: 'El teléfono debe tener 10 dígitos'
                     }
                   })}
                   className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-green-500 focus:ring focus:ring-green-200"
                   disabled={loading}
                 />
                 {errors.telefono && (
                   <span className="text-red-500 text-sm">{errors.telefono.message}</span>
                 )}
               </div>
             </div>
           </div>

           <div className={activeTab === 'acceso' ? 'block' : 'hidden'}>
             <div className="grid grid-cols-2 gap-4">
               <div>
                 <label className="block text-sm font-medium text-gray-700">Usuario</label>
                 <input
                   type="text"
                   {...register('usuario', {
                     required: 'El usuario es requerido',
                     minLength: {
                       value: 4,
                       message: 'El usuario debe tener al menos 4 caracteres'
                     }
                   })}
                   className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-green-500 focus:ring focus:ring-green-200"
                   disabled={loading}
                 />
                 {errors.usuario && (
                   <span className="text-red-500 text-sm">{errors.usuario.message}</span>
                 )}
               </div>
               
                <div>
                  <label className="block text-sm font-medium text-gray-700">
                    Contraseña {!editingUser && <span className="text-red-500">*</span>}
                  </label>
                  <input
                    type="password"
                    {...register('password', {
                      required: !editingUser,
                      minLength: {
                        value: 6,
                        message: 'La contraseña debe tener al menos 6 caracteres'
                      }
                    })}
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-green-500 focus:ring focus:ring-green-200"
                    disabled={loading}
                  />
                  {errors.password && (
                    <span className="text-red-500 text-sm">{errors.password.message}</span>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700">Rol</label>
                  <select
                    {...register('role', { required: 'El rol es requerido' })}
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-green-500 focus:ring focus:ring-green-200"
                    disabled={loading}
                  >
                    <option value="">Seleccione un rol</option>
                    <option value="ADMIN">Administrador</option>
                    <option value="PRODUCER">Productor</option>
                  </select>
                  {errors.role && (
                    <span className="text-red-500 text-sm">{errors.role.message}</span>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700">Estado</label>
                  <select
                    {...register('status', { required: 'El estado es requerido' })}
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-green-500 focus:ring focus:ring-green-200"
                    disabled={loading}
                  >
                    <option value="ACTIVO">Activo</option>
                    <option value="INACTIVO">Inactivo</option>
                  </select>
                  {errors.status && (
                    <span className="text-red-500 text-sm">{errors.status.message}</span>
                  )}
                </div>
              </div>
            </div>

            {/* Certificaciones */}
            <div className={activeTab === 'certificaciones' ? 'block' : 'hidden'}>
              <div className="space-y-2">
                {CERTIFICATION_OPTIONS.map((cert) => (
                  <label key={cert.value} className="flex items-center space-x-2 p-2 rounded hover:bg-gray-50">
                    <input
                      type="checkbox"
                      checked={selectedCertifications.includes(cert.value as Certification)}
                      onChange={() => handleCertificationChange(cert.value as Certification)}
                      className="rounded border-gray-300 text-green-600 focus:ring-green-500"
                    />
                    <span className="text-sm text-gray-700">{cert.label}</span>
                  </label>
                ))}
              </div>
            </div>

            <div className="flex justify-end space-x-3 mt-6">
              <Button
                type="button"
                variant="secondary"
                onClick={() => setShowModal(false)}
                disabled={loading}
              >
                Cancelar
              </Button>
              <Button
                type="submit"
                variant="primary"
                loading={loading}
              >
                {editingUser ? 'Actualizar' : 'Crear'} Usuario
              </Button>
            </div>
          </form>
        </div>
      </Modal>
    </div>
  );
};