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
import { addTeamManager, deleteTeamManager, deleteTeamMember, getTeamMember } from '@/api/team';

const userID = parseInt(localStorage.getItem('userID') as string);
const route = useRoute();
const isManager = ref(false);
const teamInvite = ref<InstanceType<typeof TeamInvite> | null>(null);
const tableData = ref<Array<any>>([]);
const isReloading = ref(false);
const emits = defineEmits(['require-reload']);
const nameColumn = reactive<DataTableBaseColumn>({
  title: '姓名',
  key: 'username',
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
          disabled={!isManager.value || rowData.id === userID}
          onClick={() => {
            handleDeleteMember(rowData);
          }}
        >
          踢出组织
        </NButton>
        <NButton
          size="small"
          disabled={!isManager.value as boolean}
          type={rowData.isManager ? 'primary' : 'tertiary'}
          onClick={() => {
            handleUpdateManager(rowData);
          }}
        >
          管理员
        </NButton>
        <NButton
          size={'small'}
          disabled={!isManager.value as boolean}
          type={rowData.isManager ? 'tertiary' : 'primary'}
          onClick={() => {
            handleDeleteManager(rowData);
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
  {
    title: '加入状态',
    key: 'status',
    sorter: 'default',
  },
  buttomColumn,
]);
const pagination = reactive({
  page: 1,
  pageSize: 10,
  itemCount: unref(tableData).length,
  onChange: (page: number) => {
    pagination.page = page;
  },
});

function handleFilterSearch(value: string) {
  nameColumn.filterOptionValue = value;
}

function handleInviteUser() {}
function handleDeleteMember(rowData: any) {
  deleteTeamMember({ teamID: route.params.teamID as string, userID: rowData.id })
    .then((res) => {
      if (res.data.result == 0) {
        window.$message.info(res.data.message);
      }
    })
    .finally(reload);
}
function handleUpdateManager(rowData: any) {
  if (rowData.isManager) return;
  addTeamManager({ teamID: route.params.teamID as string, userID: rowData.userID }).then((res) => {
    if (res.data.result == 0) {
      tableData.value[rowData.key].identity = '管理员';
      tableData.value[rowData.key].isManager = true;
    }
  });
}
function handleDeleteManager(rowData: any) {
  if (!rowData.isManager) return;
  deleteTeamManager({ teamID: route.params.id as string, userID: rowData.userID }).then((res) => {
    if (res.data.result) {
      tableData.value[rowData.key].identity = '组员';
      tableData.value[rowData.key].isManager = false;
    }
  });
}

function reload() {
  isReloading.value = true;
  getTeamMember({ teamID: route.params.teamID as string }).then((res) => {
    if (res.data.result) {
      tableData.value = res.data.userList.map(
        (item: { userID: number; username: string; email: string; authority: number }, index: number) => {
          if (userID == item.userID && item.authority > 0) {
            isManager.value = true;
          }
          return {
            ...item,
            key: index,
            identity: () => {
              if (item.authority == 2) {
                return '项目创建人';
              } else if (item.authority == 1) {
                return '管理员';
              } else if (item.authority == 0) {
                return '普通成员';
              }
            },
            status: item.authority < 0 ? '暂未加入' : '已加入',
          };
        }
      );
    }
    isReloading.value = false;
  });
}
defineExpose({ handleFilterSearch, handleInviteUser, reload });
onMounted(reload);
</script>

<style scoped></style>
