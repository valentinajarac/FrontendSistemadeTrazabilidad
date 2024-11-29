import React, { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { User, Certification } from '../../types';
import { Button } from '../ui/Button';
import { UserCircle, Building2, Key, Award } from 'lucide-react';
import { MUNICIPALITIES } from '../../utils/municipalities';

interface UserFormProps {
 onSubmit: (data: Omit<User, 'id'>) => Promise<void>;
 initialData?: User | null;
 onClose: () => void;
 loading?: boolean;
}

type TabType = 'personal' | 'ubicacion' | 'acceso' | 'certificaciones';

const CERTIFICATION_OPTIONS = [
 { value: 'FAIRTRADE_USA', label: 'Fairtrade USA' },
 { value: 'GLOBAL_GAP', label: 'Global GAP' },
 { value: 'ICA', label: 'ICA' }
];

export function UserForm({ onSubmit, initialData, onClose, loading }: UserFormProps) {
 const [activeTab, setActiveTab] = useState<TabType>('personal');
 
 const { register, handleSubmit, formState: { errors }, setValue, watch } = useForm<Omit<User, 'id'>>({
   defaultValues: {
     ...initialData,
     status: initialData?.status || 'ACTIVO',
     certifications: initialData?.certifications || [],
     municipio: initialData?.municipio || ''
   }
 });

 const selectedCertifications = watch('certifications') || [];

 const handleCertificationChange = (cert: Certification) => {
   const current = selectedCertifications;
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

 useEffect(() => {
   if (initialData?.municipio) {
     setValue('municipio', initialData.municipio);
   }
 }, [initialData, setValue]);

 return (
   <div className="flex h-[600px] max-h-[80vh]">
     <div className="w-48 bg-gray-50 border-r border-gray-200">
       <nav className="space-y-1 p-4">
         {tabs.map(tab => (
           <button
             key={tab.id}
             type="button"
             onClick={() => setActiveTab(tab.id as TabType)}
             className={`w-full flex items-center px-3 py-2 text-sm font-medium rounded-md transition-colors ${
               activeTab === tab.id
                 ? 'bg-green-50 text-green-700'
                 : 'text-gray-600 hover:bg-gray-100'
             }`}
           >
             <tab.icon className="w-5 h-5 mr-2" />
             {tab.label}
           </button>
         ))}
       </nav>
     </div>

     <div className="flex-1 flex flex-col">
       <form onSubmit={handleSubmit(onSubmit)} className="flex-1 flex flex-col">
         <div className="flex-1 p-6 overflow-y-auto">
           <div className={`space-y-4 ${activeTab === 'personal' ? 'block' : 'hidden'}`}>
             <div className="grid grid-cols-2 gap-4">
               <div>
                 <label className="block text-sm font-medium text-gray-700">
                   Cédula
                 </label>
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
                 <label className="block text-sm font-medium text-gray-700">
                   Código de Trazabilidad
                 </label>
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

             <div>
               <label className="block text-sm font-medium text-gray-700">
                 Nombre Completo
               </label>
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
           </div>

           <div className={`space-y-4 ${activeTab === 'ubicacion' ? 'block' : 'hidden'}`}>
             <div className="grid grid-cols-2 gap-4">
               <div>
                 <label className="block text-sm font-medium text-gray-700">
                   Municipio
                 </label>
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
                 <label className="block text-sm font-medium text-gray-700">
                   Teléfono
                 </label>
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

           <div className={`space-y-4 ${activeTab === 'acceso' ? 'block' : 'hidden'}`}>
             <div className="grid grid-cols-2 gap-4">
               <div>
                 <label className="block text-sm font-medium text-gray-700">
                   Usuario
                 </label>
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
                   Contraseña {!initialData && <span className="text-red-500">*</span>}
                 </label>
                 <input
                   type="password"
                   {...register('password', {
                     required: !initialData,
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
                 <label className="block text-sm font-medium text-gray-700">
                   Rol
                 </label>
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
                 <label className="block text-sm font-medium text-gray-700">
                   Estado
                 </label>
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

           <div className={`${activeTab === 'certificaciones' ? 'block' : 'hidden'}`}>
             <div className="bg-white rounded-lg border border-gray-200 divide-y">
               {CERTIFICATION_OPTIONS.map((cert) => (
                 <label
                   key={cert.value}
                   className="flex items-center p-4 hover:bg-gray-50 cursor-pointer"
                 >
                   <input
                     type="checkbox"
                     checked={selectedCertifications.includes(cert.value as Certification)}
                     onChange={() => handleCertificationChange(cert.value as Certification)}
                     className="h-4 w-4 rounded border-gray-300 text-green-600 focus:ring-green-500"
                   />
                   <span className="ml-3 text-sm font-medium text-gray-700">{cert.label}</span>
                 </label>
               ))}
             </div>
           </div>
         </div>

         <div className="flex justify-end gap-3 px-6 py-4 bg-gray-50 border-t">
           <Button
             type="button"
             variant="secondary"
             onClick={onClose}
             disabled={loading}
           >
             Cancelar
           </Button>
           <Button
             type="submit"
             variant="primary"
             loading={loading}
           >
             {initialData ? 'Actualizar' : 'Crear'} Usuario
           </Button>
         </div>
       </form>
     </div>
   </div>
 );
}