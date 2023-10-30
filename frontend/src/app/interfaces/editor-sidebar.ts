export interface EditorSidebarParams {
  editor_id: string;
  title?: {
    create: string;
    edit: string;
    remove: string;
  };
  button?: {
    create?: {
      submit?: string;
      cancel?: string;
    };
    edit?: {
      submit?: string;
      cancel?: string;
    };
    remove?: {
      submit?: string;
      cancel?: string;
    };
  };
  url: string;
  method: string;
  action: string;
  row?: any;
  row_id?: string;
  use_data?: boolean; // if true, the data will be used to fill the form when creating
}
