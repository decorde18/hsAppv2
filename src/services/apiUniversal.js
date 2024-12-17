import { deleteGoogleCalendarEvent } from './apiGoogle';
import supabase from './supabase';

/**
 * Creates new data in the specified table.
 * @param {Object} options - Options for data creation.
 * @param {Object|Array} options.newData - The data to insert (can be an array for bulk inserts).
 * @param {string} options.table - The table name.
 * @param {string} options.view - The view name.
 * @param {boolean} [options.toast=true] - Whether to show a toast notification.
 * @returns {Promise<Object>} - The result of the insert operation.
 * @throws {Error} - If the operation fails.
 */
export async function createDataApi({ newData, table, view, toast = true }) {
  try {
    if (Array.isArray(newData)) {
      // Bulk insert
      const { data, error } = await supabase
        .from(table)
        .insert(newData)
        .select();

      if (error) {
        console.error('Bulk Insert Error:', error);
        throw new Error(
          `Data in ${table} could not be created: ${error.message}`
        );
      }

      return { data, table, view, toast };
    } else {
      // Single insert
      const { data, error } = await supabase
        .from(table)
        .insert([{ ...newData }])
        .select();

      if (error) {
        console.error('Insert Error:', error);
        throw new Error(
          `Data in ${table} could not be created: ${error.message}`
        );
      }

      return { data, table, view, toast };
    }
  } catch (err) {
    console.error('Unexpected Error in createDataApi:', err);
    throw err;
  }
}

/**
 * Retrieves data from the specified table with optional filters, search, and sorting.
 * @param {Object} options - Options for data retrieval.
 * @param {string} options.table - The table name.
 * @param {Array} [options.filter] - Array of filter objects.
 * @param {Array} [options.search] - Array of search criteria.
 * @param {Array} [options.sort] - Array of sort criteria.
 * @returns {Promise<Array>} - The retrieved data.
 * @throws {Error} - If the operation fails.
 */
export async function getData({ table, filter, search, sort }) {
  try {
    let query = supabase.from(table).select('*');

    if (filter) {
      filter.forEach((each) => {
        query = each.textSearch
          ? query.textSearch(each.field, each.value.join(' or '), {
              type: 'websearch',
              config: 'english',
            })
          : query.filter(each.field, 'in', `(${each.value})`);
      });
    }

    if (sort) {
      sort.forEach((each) => {
        query = query.order(each.field, { ascending: each.direction });
      });
    }

    if (search) {
      search.forEach((each) => {
        query = query.ilike(each.field, `%${each.value}%`);
      });
    }

    const { data, error } = await query;

    if (error) {
      console.error('Query Error:', error);
      throw new Error(`${table} could not be loaded: ${error.message}`);
    }

    return data;
  } catch (err) {
    console.error('Unexpected Error in getData:', err);
    throw err;
  }
}

/**
 * Updates data in the specified table.
 * @param {Object} options - Options for data update.
 * @param {string} options.table - The table name.
 * @param {Array|Object} options.newData - The data to update (can be an array for bulk updates).
 * @param {number|string|Array<number|string>} options.id - The ID(s) of the record(s) to update.
 * @param {string} options.view - The view name.
 * @returns {Promise<Object>} - The result of the update operation.
 * @throws {Error} - If the operation fails.
 */
export async function updateDataApi({ table, newData, id, view }) {
  try {
    if (
      Array.isArray(newData) &&
      Array.isArray(id) &&
      newData.length === id.length
    ) {
      // Bulk update: Ensure newData and id arrays have matching indices
      const results = [];

      for (let i = 0; i < newData.length; i++) {
        const { data, error } = await supabase
          .from(table)
          .update(newData[i])
          .eq('id', id[i])
          .select();

        if (error) {
          console.error('Bulk Update Error:', error);
          throw new Error(`${table} could not be updated: ${error.message}`);
        }

        results.push(data);
      }

      return { data: results.flat(), table, view };
    } else if (!Array.isArray(newData)) {
      // Single update
      const { data, error } = await supabase
        .from(table)
        .update(newData)
        .eq('id', id)
        .select();

      if (error) {
        console.error('Update Error:', error);
        throw new Error(`${table} could not be updated: ${error.message}`);
      }

      return { data, table, view };
    } else {
      throw new Error(
        'Invalid input: newData and id arrays must have the same length.'
      );
    }
  } catch (err) {
    console.error('Unexpected Error in updateDataApi:', err);
    throw err;
  }
}

/**
 * Deletes data from the specified table and optionally removes a Google Calendar event.
 * @param {Object} options - Options for data deletion.
 * @param {string} options.table - The table name.
 * @param {number|string} options.id - The ID of the record to delete.
 * @param {Object} [options.calendarEvent] - Details of the calendar event to delete.
 * @param {string} [options.view] - The view name.
 * @returns {Promise<Object>} - The result of the deletion.
 * @throws {Error} - If the operation fails.
 */
export async function deleteDataApi({ table, id, calendarEvent, view }) {
  try {
    const { error } = await supabase.from(table).delete().eq('id', id);

    if (error) {
      console.error('Delete Error:', error);
      throw new Error(`${table} could not be deleted: ${error.message}`);
    }

    if (calendarEvent) {
      try {
        const { calendar, calId } = calendarEvent;
        await deleteGoogleCalendarEvent(calendar, calId);
      } catch (calendarError) {
        console.error('Calendar Deletion Error:', calendarError);
        throw new Error(
          `Calendar event could not be deleted: ${calendarError.message}`
        );
      }
    }

    return { table, view };
  } catch (err) {
    console.error('Unexpected Error in deleteDataApi:', err);
    throw err;
  }
}
