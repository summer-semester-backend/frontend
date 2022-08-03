<template>
  <n-data-table
    :columns="columns"
    :data="tableData"
    :loading="isReloading"
    :pagination="pagination"
    style="height: 620px"
  >
  </n-data-table>
  <team-invite ref="teamInvite" />
</template>

<script setup lang="tsx">
import { NDataTable, NButton, NButtonGroup } from 'naive-ui';
import type { DataTableBaseColumn, DataTableColumns } from 'naive-ui';
import { onMounted, ref, reactive, unref } from 'vue';
import TeamInvite from './modal/TeamInvite.vue';
import { useRoute } from 'vue-router';

const userID = parseInt(localStorage.getItem('userID') as string);

const props = defineProps<{ tableData: Array<User.UserTableData>; isReloading: boolean }>();
const isAdmin = ref(false);
const teamInvite = ref<InstanceType<typeof TeamInvite> | null>(null);
const nameColumn = reactive<DataTableBaseColumn>({
  title: '姓名',
  key: 'name',
  filter: 'default',
  filterOptionValue: null,
  sorter(rowA: any, rowB: any) {
    return rowA.name.length - rowB.name.length;
  },
});
const buttomColumn = reactive<DataTableBaseColumn>({
  title: '操作',
  key: 'actions',
  width: '200px',
  render(rowData: any) {
    return (
      <NButtonGroup>
        <NButton
          size="small"
          disabled={!isAdmin.value || rowData.id === userID}
          onClick={() => {
            handleDeleteMember(rowData);
          }}
        >
          踢出组织
        </NButton>
        <NButton
          size="small"
          disabled={!isAdmin.value as boolean}
          type={rowData.isAdmin ? 'primary' : 'tertiary'}
          onClick={() => {
            handleUpdateAdmin(rowData);
          }}
        >
          管理员
        </NButton>
        <NButton
          size={'small'}
          disabled={!isAdmin.value as boolean}
          type={rowData.isAdmin ? 'tertiary' : 'primary'}
          onClick={() => {
            handleDeleteAdmin(rowData);
          }}
        >
          组员
        </NButton>
      </NButtonGroup>
    );
  },
});
const columns = reactive<DataTableColumns>([
  nameColumn,
  {
    title: '邮箱',
    key: 'email',
  },
  {
    title: '身份',
    key: 'identity',
    sorter: 'default',
  },
  buttomColumn,
]);
const pagination = reactive({
  page: 1,
  pageSize: 10,
  itemCount: unref(props.tableData).length,
  onChange: (page: number) => {
    pagination.page = page;
  },
});

function handleFilterSearch(value: string) {
  nameColumn.filterOptionValue = value;
}

function handleInviteUser() {}
function handleDeleteMember(rowData: any) {
  // deleteTeamMember(route.params.id as string, rowData.id).finally(reload);
}
function handleUpdateAdmin(rowData: any) {
  // if (rowData.isAdmin) return;
  // updateTeamAdmin({
  //   userID: rowData.id,
  //   teamID: route.params.id as string,
  // }).then((res) => {
  //   if (res.data.success) {
  //     tableData.value[rowData.key].identity = '管理员';
  //     tableData.value[rowData.key].isAdmin = true;
  //   }
  // });
}
function handleDeleteAdmin(rowData: any) {
  // if (!rowData.isAdmin) return;
  // deleteTeamAdmin(rowData.id, route.params.id as string).then((res) => {
  //   if (res.data.success) {
  //     tableData.value[rowData.key].identity = '组员';
  //     tableData.value[rowData.key].isAdmin = false;
  //   }
  // });
}
defineExpose({ handleFilterSearch, handleInviteUser });
</script>

<style scoped></style>
