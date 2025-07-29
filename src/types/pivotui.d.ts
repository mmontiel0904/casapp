declare module 'pivotui' {
  import { DefineComponent } from 'vue'

  export interface ButtonProps {
    variant?: 'primary' | 'secondary' | 'outline' | 'ghost' | 'danger'
    size?: 'sm' | 'md' | 'lg'
    type?: 'button' | 'submit' | 'reset'
    disabled?: boolean
  }

  export interface TableColumn {
    key: string
    label: string
    sortable?: boolean
  }

  export interface TableProps {
    columns: TableColumn[]
    data: Record<string, any>[]
    striped?: boolean
    hover?: boolean
    density?: 'compact' | 'comfortable' | 'spacious'
  }

  export const Button: DefineComponent<ButtonProps>
  export const Table: DefineComponent<TableProps>
}