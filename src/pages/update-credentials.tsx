import { useState, useRef, useEffect } from 'react';
import { InputText } from 'primereact/inputtext';
import { Password } from 'primereact/password';
import { Button } from 'primereact/button';
import { Card } from 'primereact/card';
import { Toast } from 'primereact/toast';
import { DataTable } from 'primereact/datatable';
import { Column } from 'primereact/column';
import { Dialog } from 'primereact/dialog';
import { classNames } from 'primereact/utils';
import 'primereact/resources/themes/saga-blue/theme.css';
import 'primereact/resources/primereact.min.css';
import 'primeicons/primeicons.css';
import 'primeflex/primeflex.css';

interface User {
  id: string;
  email: string;
  role: string;
  createdAt: Date;
}

export default function AdministratorDashboard() {
  const toast = useRef<Toast>(null);
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState({
    table: false,
    form: false
  });
  const [formData, setFormData] = useState({
    currentEmail: '',
    newEmail: '',
    newPassword: '',
    confirmPassword: ''
  });
  const [submitted, setSubmitted] = useState(false);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    try {
      setLoading(prev => ({ ...prev, table: true }));
      const response = await fetch('/api/auth/users');
      if (!response.ok) throw new Error('Failed to fetch users');
      const data = await response.json();
      setUsers(data);
    } catch (error) {
      showToast('error', 'Error', 'Failed to fetch users');
    } finally {
      setLoading(prev => ({ ...prev, table: false }));
    }
  };

  const showToast = (severity: 'success' | 'error', summary: string, detail: string) => {
    toast.current?.show({ severity, summary, detail, life: 3000 });
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitted(true);
    
    if (isDisabled) return;
    
    setLoading(prev => ({ ...prev, form: true }));

    if (formData.newPassword && formData.newPassword !== formData.confirmPassword) {
      showToast('error', 'Error', 'New passwords do not match');
      setLoading(prev => ({ ...prev, form: false }));
      return;
    }

    try {
      const response = await fetch('/api/auth/update-credentials', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          currentEmail: formData.currentEmail,
          newEmail: formData.newEmail || undefined,
          newPassword: formData.newPassword || undefined
        }),
      });

      const data = await response.json();

      if (!response.ok) throw new Error(data.message || 'Update failed');

      showToast('success', 'Success', 'Credentials updated successfully');
      setVisible(false);
      setFormData({
        currentEmail: formData.newEmail || formData.currentEmail,
        newEmail: '',
        newPassword: '',
        confirmPassword: ''
      });
      setSubmitted(false);
      fetchUsers();

    } catch (error: any) {
      showToast('error', 'Error', error.message || 'Failed to update credentials');
    } finally {
      setLoading(prev => ({ ...prev, form: false }));
    }
  };

  const hasChanges = Boolean(formData.newEmail || formData.newPassword);
  const passwordsMatch = !formData.newPassword || formData.newPassword === formData.confirmPassword;
  const isDisabled = !hasChanges || !passwordsMatch || !formData.currentEmail;

  const getFormErrorMessage = (name: string) => {
    if (!submitted) return null;
    
    if (name === 'currentEmail' && !formData.currentEmail) {
      return <small className="p-error">Current email is required</small>;
    }
    
    if (name === 'confirmPassword' && formData.newPassword && !passwordsMatch) {
      return <small className="p-error">Passwords do not match</small>;
    }
  };

  const dateBodyTemplate = (rowData: User) => {
    return new Date(rowData.createdAt).toLocaleDateString();
  };

  const actionBodyTemplate = (rowData: User) => {
    return (
      <Button
        icon="pi pi-cog"
        className="p-button-rounded p-button-text"
        onClick={() => {
          setFormData({
            currentEmail: rowData.email,
            newEmail: '',
            newPassword: '',
            confirmPassword: ''
          });
          setVisible(true);
        }}
      />
    );
  };

  return (
    <div className="p-4">
      <Toast ref={toast} position="top-right" />
      <h1 className="text-3xl font-bold mb-4">Administrator Dashboard</h1>

      <Card className="mb-4">
        <div className="flex justify-content-between align-items-center mb-4">
          <h2 className="text-xl font-semibold">User Management</h2>
        </div>

        <DataTable
          value={users}
          paginator
          rows={10}
          loading={loading.table}
          rowsPerPageOptions={[5, 10, 25]}
          paginatorTemplate="FirstPageLink PrevPageLink PageLinks NextPageLink LastPageLink CurrentPageReport RowsPerPageDropdown"
          currentPageReportTemplate="Showing {first} to {last} of {totalRecords} users"
          emptyMessage="No users found"
          className="p-datatable-sm"
        >
          <Column field="email" header="Email" sortable></Column>
          <Column field="role" header="Role" sortable></Column>
          <Column 
            field="createdAt" 
            header="Joined Date" 
            body={dateBodyTemplate} 
            sortable
          ></Column>
          <Column 
            body={actionBodyTemplate} 
            header="Actions"
            style={{ width: '80px' }}
          ></Column>
        </DataTable>
      </Card>

      <Dialog
        header="Update User Credentials"
        visible={visible}
        style={{ width: '500px' }}
        onHide={() => setVisible(false)}
      >
        <form onSubmit={handleSubmit} className="p-fluid space-y-4">
          <div className="field">
            <label htmlFor="currentEmail" className="block mb-2 font-medium">Current Email*</label>
            <InputText
              id="currentEmail"
              name="currentEmail"
              type="email"
              value={formData.currentEmail}
              onChange={handleChange}
              required
              className={classNames('w-full', { 'p-invalid': submitted && !formData.currentEmail })}
              readOnly
            />
            {getFormErrorMessage('currentEmail')}
          </div>

          <div className="field">
            <label htmlFor="newEmail" className="block mb-2 font-medium">New Email (optional)</label>
            <InputText
              id="newEmail"
              name="newEmail"
              type="email"
              value={formData.newEmail}
              onChange={handleChange}
              className="w-full"
              placeholder="new.email@example.com"
            />
            <small className="p-text-secondary">Leave blank to keep current email</small>
          </div>

          <div className="field">
            <label htmlFor="newPassword" className="block mb-2 font-medium">New Password (optional)</label>
            <Password
              id="newPassword"
              name="newPassword"
              value={formData.newPassword}
              onChange={handleChange}
              toggleMask
              className="w-full"
              placeholder="Enter new password"
              inputClassName="w-full"
            />
            <small className="p-text-secondary">Leave blank to keep current password</small>
          </div>

          {formData.newPassword && (
            <div className="field">
              <label htmlFor="confirmPassword" className="block mb-2 font-medium">Confirm New Password*</label>
              <Password
                id="confirmPassword"
                name="confirmPassword"
                value={formData.confirmPassword}
                onChange={handleChange}
                toggleMask
                feedback={false}
                className={classNames('w-full', { 'p-invalid': submitted && !passwordsMatch })}
                inputClassName="w-full"
                placeholder="Confirm new password"
              />
              {getFormErrorMessage('confirmPassword')}
            </div>
          )}

          <div className="flex justify-content-end gap-2 mt-4">
            <Button
              type="button"
              label="Cancel"
              icon="pi pi-times"
              className="p-button-text"
              onClick={() => setVisible(false)}
            />
            <Button
              type="submit"
              label="Update"
              icon="pi pi-check"
              loading={loading.form}
              disabled={isDisabled}
            />
          </div>
        </form>
      </Dialog>
    </div>
  );
}