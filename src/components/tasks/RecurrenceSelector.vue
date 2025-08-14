<template>
  <div class="form-control w-full">
    <label class="label">
      <span class="label-text font-medium">Recurrence</span>
    </label>
    
    <!-- Recurrence Type Selector -->
    <select 
      :value="recurrenceType"
      @change="updateRecurrenceType(($event.target as HTMLSelectElement).value)"
      class="select select-ghost select-lg w-full bg-base-100 focus:bg-base-50 hover:bg-base-200/30 hover:border-primary/40 focus:outline-none border-b-2 border-transparent focus:border-primary transition-all duration-200"
    >
      <option value="NONE">No Recurrence</option>
      <option value="DAILY">Daily</option>
      <option value="WEEKDAYS">Weekdays (Mon-Fri)</option>
      <option value="WEEKLY">Weekly</option>
      <option value="MONTHLY">Monthly</option>
    </select>
    
    <!-- Day Selector for Weekly Recurrence -->
    <div v-if="recurrenceType === 'WEEKLY'" class="mt-3">
      <label class="label">
        <span class="label-text text-sm text-base-content/70">Repeat on:</span>
      </label>
      <select 
        :value="recurrenceDay || 1"
        @change="updateRecurrenceDay(parseInt(($event.target as HTMLSelectElement).value))"
        class="select select-ghost w-full bg-base-100 focus:bg-base-50 hover:bg-base-200/30 hover:border-primary/40 focus:outline-none border-b-2 border-transparent focus:border-primary transition-all duration-200"
      >
        <option value="1">Monday</option>
        <option value="2">Tuesday</option>
        <option value="3">Wednesday</option>
        <option value="4">Thursday</option>
        <option value="5">Friday</option>
        <option value="6">Saturday</option>
        <option value="7">Sunday</option>
      </select>
    </div>
    
    <!-- Day Selector for Monthly Recurrence -->
    <div v-if="recurrenceType === 'MONTHLY'" class="mt-3">
      <label class="label">
        <span class="label-text text-sm text-base-content/70">Day of month:</span>
      </label>
      <input 
        type="number"
        :value="recurrenceDay || 1"
        @input="updateRecurrenceDay(parseInt(($event.target as HTMLInputElement).value))"
        min="1"
        max="31"
        class="input input-ghost w-full bg-base-100 focus:bg-base-50 hover:bg-base-200/30 hover:border-primary/40 focus:outline-none border-b-2 border-transparent focus:border-primary transition-all duration-200"
        placeholder="e.g., 15 for 15th of each month"
      />
    </div>
    
    <!-- Recurrence Preview -->
    <div v-if="recurrenceType !== 'NONE'" class="mt-3">
      <div class="bg-info/10 border-l-4 border-info/30 p-3 rounded">
        <div class="flex items-center gap-2">
          <svg class="w-4 h-4 text-info" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
          </svg>
          <span class="text-sm font-medium text-info">{{ getRecurrenceDescription }}</span>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { RecurrenceType } from '../../generated/graphql'

interface Props {
  recurrenceType?: RecurrenceType
  recurrenceDay?: number | null
}

interface Emits {
  (e: 'update:recurrenceType', value: RecurrenceType): void
  (e: 'update:recurrenceDay', value: number | null): void
}

const props = withDefaults(defineProps<Props>(), {
  recurrenceType: RecurrenceType.None,
  recurrenceDay: null
})

const emit = defineEmits<Emits>()

const updateRecurrenceType = (value: string) => {
  const recurrenceType = value as RecurrenceType
  emit('update:recurrenceType', recurrenceType)
  
  // Reset recurrence day when changing types
  if (recurrenceType !== RecurrenceType.Weekly && recurrenceType !== RecurrenceType.Monthly) {
    emit('update:recurrenceDay', null)
  } else if (recurrenceType === RecurrenceType.Weekly && !props.recurrenceDay) {
    emit('update:recurrenceDay', 1) // Default to Monday
  } else if (recurrenceType === RecurrenceType.Monthly && !props.recurrenceDay) {
    emit('update:recurrenceDay', 1) // Default to 1st of month
  }
}

const updateRecurrenceDay = (value: number) => {
  emit('update:recurrenceDay', value)
}

const getDayName = (day: number): string => {
  const days = ['', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday']
  return days[day] || 'Monday'
}

const getOrdinal = (day: number): string => {
  if (day >= 11 && day <= 13) return `${day}th`
  switch (day % 10) {
    case 1: return `${day}st`
    case 2: return `${day}nd`
    case 3: return `${day}rd`
    default: return `${day}th`
  }
}

const getRecurrenceDescription = computed((): string => {
  switch (props.recurrenceType) {
    case RecurrenceType.Daily:
      return 'Repeats every day'
    case RecurrenceType.Weekdays:
      return 'Repeats Monday through Friday'
    case RecurrenceType.Weekly:
      return `Repeats every ${getDayName(props.recurrenceDay || 1)}`
    case RecurrenceType.Monthly:
      return `Repeats on the ${getOrdinal(props.recurrenceDay || 1)} of each month`
    default:
      return 'No recurrence'
  }
})
</script>