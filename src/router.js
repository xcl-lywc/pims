import Vue from 'vue'
import Router from 'vue-router'
//dashboard
import Dashboard from './views/Dashboard.vue'
//登录
import LoginIndex from './views/Login.vue'
//注册
import RegIndex from './views/Reg.vue'
//相关通知
import Notices from './views/NoticesList.vue'
//申报项目管理
import ProjectSetUpIndex from './views/projectSetUp/Index.vue'
import DeclareIndex from './views/projectSetUp/projectDeclare/Index.vue'
import DeclareList from './views/projectSetUp/projectDeclare/DeclareList.vue'
import DeclareForm from './views/projectSetUp/projectDeclare/DeclareForm.vue'
import DeclareAgain from './views/projectSetUp/projectDeclare/DeclareAgain.vue'
import DeclareDetail from './views/projectSetUp/projectDeclare/DeclareDetail.vue'
import AcceptanceIndex from './views/projectSetUp/projectAcceptance/Index.vue'
import AcceptanceList from './views/projectSetUp/projectAcceptance/AcceptanceList.vue'
import AcceptanceProject from './views/projectSetUp/projectAcceptance/AcceptanceProject.vue'
import PretrialIndex from './views/projectSetUp/projectPretrial/Index.vue'
import PretrialList from './views/projectSetUp/projectPretrial/PretrialList.vue'
import PretrialExpert from './views/projectSetUp/projectPretrial/PretrialExpert.vue'
import PretrialExpertGroup from './views/projectSetUp/projectPretrial/PretrialExpertGroup.vue'
import ReviewIndex from './views/projectSetUp/reviewExpert/Index.vue'
import ReviewList from './views/projectSetUp/reviewExpert/ReviewList.vue'
import ReviewRecord from './views/projectSetUp/reviewExpert/ReviewRecord.vue'
import ReviewApproval from './views/projectSetUp/reviewExpert/ReviewApproval.vue'
import LeaderIndex from './views/projectSetUp/reviewLeader/Index.vue'
import LeaderList from './views/projectSetUp/reviewLeader/ReviewList.vue'
import LeaderRecord from './views/projectSetUp/reviewLeader/ReviewRecord.vue'
import LeaderApproval from './views/projectSetUp/reviewLeader/ReviewApproval.vue'
import FinancialIndex from './views/projectSetUp/FinancialApproval/Index.vue'
import FinancialList from './views/projectSetUp/FinancialApproval/FinancialList.vue'
import FinancialApproval from './views/projectSetUp/FinancialApproval/FinancialApproval.vue'
import FileIndex from './views/projectSetUp/projectFile/Index.vue'
import FileList from './views/projectSetUp/projectFile/FileList.vue'
import FileProject from './views/projectSetUp/projectFile/FileProject.vue'
import TrackIndex from './views/projectSetUp/projectTrack/Index.vue'
import ApprovalList from './views/projectSetUp/projectTrack/ApprovalList.vue'
import TrackList from './views/projectSetUp/projectTrack/TrackList.vue'
import TrackList_ from './views/projectSetUp/projectTrack/TrackList_.vue'
import ProjectEdit from './views/projectSetUp/projectEdit.vue'
//申报项目查询
import ProjectQueryIndex from './views/projectQuery/Index.vue'
import ProjectBudget from './views/projectQuery/Budget.vue'
import ProjectDirector from './views/projectQuery/Director.vue'
import ProjectExpert from './views/projectQuery/Expert.vue'
import ProjectOther from './views/projectQuery/Other.vue'
import ProjectReporting from './views/projectQuery/Reporting.vue'
//项目进度管理
import ProjectScheduleIndex from './views/projectSchedule/Index.vue'
import ScheduleReport from './views/projectSchedule/Report/Index.vue'
import ReportList from './views/projectSchedule/Report/List.vue'
import ReportDetail from './views/projectSchedule/Report/Detail.vue'
import ScheduleSupervise from './views/projectSchedule/Supervise.vue'
//项目库管理
import ProjectLibraryIndex from './views/projectLibrary/Index.vue'
import ProjectAdd          from './views/projectLibrary/Add.vue'
import ProjectDetail       from './views/projectLibrary/Detail.vue'
import ProjectManagement   from './views/projectLibrary/Management.vue'
import ProjectQuery        from './views/projectLibrary/Query.vue'
//专家库管理
import ExpertLibraryIndex from './views/expertLibrary/Index.vue'
import ExpertAdd          from './views/expertLibrary/Add.vue'
import ExpertManagement   from './views/expertLibrary/ExpertManagement.vue'
import GroupManagement    from './views/expertLibrary/GroupManagement.vue'
//系统管理
import SystemManagementIndex from './views/systemManagement/Index.vue'
import SystemDictionary from './views/systemManagement/Dictionary.vue'
import SystemJurisdiction from './views/systemManagement/Jurisdiction.vue'
import SystemMenu from './views/systemManagement/Menu.vue'
import SystemOrganization from './views/systemManagement/Organization.vue'
import SystemRole from './views/systemManagement/Role.vue'
import SystemUser from './views/systemManagement/User.vue'
import SystemUserDetail from './views/systemManagement/UserDetail.vue'
//日志管理
import LogManagementIndex from './views/logManagement/Index.vue'
import LogSystem from './views/logManagement/System.vue'
import LogUser from './views/logManagement/User.vue'
import LogSecurity from './views/logManagement/Security.vue'
//模版
// import TemplateIndex from './views/stencilPlate/Index.vue'
// import TemplateOne from './views/stencilPlate/TemplateOne.vue'
// import TemplateTwo from './views/stencilPlate/TemplateTwo.vue'
// import TemplateThree from './views/stencilPlate/TemplateThree.vue'
// import TemplateFour from './views/stencilPlate/TemplateFour.vue'

// 资讯管理
import InformationIndex      from './views/information/Index.vue'
import AddInformation        from './views/information/Add.vue'
import InformationManagement from './views/information/Management.vue'
import InformationDetail     from './views/information/Detail.vue'
import InformationColumn     from './views/information/Column.vue'
import InformationMoreColumn     from './views/information/MoreColumn.vue'

Vue.use(Router)

export default new Router({
  mode: "history",
  base: "/web/",
  routes: [
    {
      path: '/',
      name: 'Dashboard',
      component: Dashboard,
      meta: {
        showNav: true
      }
    },
    {
      path: '/login',
      name: 'LoginIndex',
      navName: '登录',
      component: LoginIndex,
      meta: {
        showNav: false
      }
    },
    {
      path: '/reg',
      name: 'RegIndex',
      navName: '注册',
      component: RegIndex,
      meta: {
        showNav: false
      }
    },
    {
      path: '/notices',
      name: 'Notices',
      navName: '相关通知',
      component: Notices,
      meta: {
        showNav: true
      }
    },
    {
      path: '/information',
      name: "Information",
      navName: '政策法规',
      navIcon: 'project',
      component: InformationIndex,
      meta: {
        showNav: true
      },
      children: [
        {
          path: 'column',
          name: 'InformationColumn',
          navName: '政策法规',
          component: InformationColumn,
          redirect: '',
          meta: {
            showNav: true
          }
        },
        {
          path: 'management',
          name: 'InformationManagement',
          navName: '信息管理',
          component: InformationManagement,
          redirect: '',
          meta: {
            showNav: true
          }
        },
        {
          path: 'add',
          name: 'AddInformation',
          navName: '新增信息',
          component: AddInformation,
          redirect: '',
          meta: {
            showNav: true
          }
        },
        {
          path: 'detail/:id/:type',
          name: 'InformationDetail',
          navName: '详情',
          component: InformationDetail,
          redirect: '',
          meta: {
            showNav: true
          }
        },
        {
          path: 'more_column/:id',
          name: 'InformationMoreColumn',
          navName: '政策法规0',
          component: InformationMoreColumn,
          redirect: '',
          meta: {
            showNav: true
          }
        },
      ]
    },
    {
      path: '/project_set_up',
      name: "ProjectSetUpIndex",
      navName: '申报项目管理',
      navIcon: 'apply',
      component: ProjectSetUpIndex,
      meta: {
        showNav: true
      },
      children: [
       {
          path: '',
          name: 'DeclareNew',
          navName: '新建申报项目',
          component: DeclareForm,
          meta: {
            showNav: true
          },
        },
        {
          path: 'declare',
          navName: '补充申报材料',
          component: DeclareIndex,
          meta: {
            showNav: true
          },
          children: [
            {
              path: '',
              name: 'DeclareList',
              navName: '项目申报列表',
              component: DeclareList,
              meta: {
                showNav: true
              },
            },
            {
              path: 'form',
              name: 'DeclareForm',
              navName: '项目申报表单',
              component: DeclareForm,
              meta: {
                showNav: true
              },
            },
            {
              path: 'form_again/:id/:type/:budgetRotation/:expertRotation',
              name: 'DeclareAgain',
              navName: '重新项目申报表单',
              component: DeclareAgain,
              meta: {
                showNav: true
              },
            },
            {
              path: 'detail/:id',
              name: 'DeclareDetail',
              navName: '项目申报详情',
              component: DeclareDetail,
              meta: {
                showNav: true
              },
            },
          ]
        },
        {
          path: 'acceptance',
          navName: '项目受理',
          component: AcceptanceIndex,
          meta: {
            showNav: true,
          },
          children: [
            {
              path: '',
              name: 'AcceptanceList',
              navName: '项目受理列表',
              component: AcceptanceList,
              meta: {
                showNav:true,
              }
            },
            {
              path: 'project',
              name: 'AcceptanceProject',
              navName: '项目受理表单',
              component: AcceptanceProject,
              meta: {
                showNav:true,
              }
            },
          ]
        },
        {
          path: 'pretrial',
          navName: '项目预审',
          component: PretrialIndex,
          meta: {
            showNav: true
          },
          children: [
            {
              path: '',
              name: 'PretrialList',
              navName: '项目预审',
              component: PretrialList,
              meta: {
                showNav: true
              },
            },
            {
              path: 'expert',
              name: 'PretrialExpert',
              navName: '项目预审',
              component: PretrialExpert,
              meta: {
                showNav: true
              },
            },
            {
              path: 'expert_group',
              name: 'PretrialExpertGroup',
              navName: '项目预审',
              component: PretrialExpertGroup,
              meta: {
                showNav: true
              },
            },
          ]
        },
        {
          path: 'review',
          navName: '专家评审',
          component: ReviewIndex,
          redirect: '',
          meta: {
            showNav: true
          },
          children: [
            {
              path: '',
              name: 'ReviewList',
              navName: '待评审项目列表',
              component: ReviewList,
              redirect: '',
              meta: {
                showNav: true
              }
            },
            {
              path: 'record',
              name: 'ReviewRecord',
              navName: '会议评审结果录入',
              component: ReviewRecord,
              redirect: '',
              meta: {
                showNav: true
              }
            },
            {
              path: 'approval',
              name: 'ReviewApproval',
              navName: '评审修改结果审批',
              component: ReviewApproval,
              redirect: '',
              meta: {
                showNav: true
              }
            },
          ]
        },
        {
          path: 'leader',
          navName: '网信会议',
          component: LeaderIndex,
          redirect: '',
          meta: {
            showNav: true
          },
          children: [
            {
              path: '',
              name: 'LeaderList',
              navName: '待领导审批项目列表',
              component: LeaderList,
              redirect: '',
              meta: {
                showNav: true
              }
            },
            {
              path: 'record',
              name: 'LeaderRecord',
              navName: '会议材料录入',
              component: LeaderRecord,
              redirect: '',
              meta: {
                showNav: true
              }
            },
            {
              path: 'approval',
              name: 'LeaderApproval',
              navName: '领导会议审批',
              component: LeaderApproval,
              redirect: '',
              meta: {
                showNav: true
              }
            },
          ]
        },
        {
          path: 'financial',
          navName: '财政意见',
          component: FinancialIndex,
          redirect: '',
          meta: {
            showNav: true
          },
          children: [
            {
              path: '',
              name: 'FinancialList',
              navName: '待财政审批列表',
              component: FinancialList,
              redirect: '',
              meta: {
                showNav: true
              }
            },
            {
              path: 'approval/:id',
              name: 'FinancialApproval',
              navName: '财政审批',
              component: FinancialApproval,
              redirect: '',
              meta: {
                showNav: true
              }
            },
          ]
        },
        {
          path: 'file',
          navName: '审核财政意见',
          component: FileIndex,
          redirect: '',
          meta: {
            showNav: true
          },
          children: [
            {
              path: '',
              name: 'FileList',
              navName: '待归档项目列表',
              component: FileList,
              redirect: '',
              meta: {
                showNav: true
              }
            },
            {
              path: 'project/:id',
              name: 'FileProject',
              navName: '项目归档',
              component: FileProject,
              redirect: '',
              meta: {
                showNav: true
              }
            },
          ]
        },
        {
          path: 'track',
          navName: '进度汇报',
          component: TrackIndex,
          redirect: '',
          meta: {
            showNav: true
          },
          children: [
            {
              path: '',
              name: 'ApprovalList',
              navName: '项目审批列表',
              component: ApprovalList,
              redirect: '',
              meta: {
                showNav: true
              },
            },
            {
              path: 'track_list/:id',
              name: 'TrackList',
              navName: '进度汇报',
              component: TrackList,
              redirect: '',
              meta: {
                showNav: true
              },
            },
            {
              path: 'track_list_',
              name: 'TrackList_',
              navName: '项目跟踪图',
              component: TrackList_,
              redirect: '',
              meta: {
                showNav: true
              },
            },
          ]
        },
        {
          path: 'director',
          name: 'ProjectDirector',
          navName: '项目查询',
          component: ProjectDirector,
          redirect: '',
          meta: {
            showNav: true
          }
        },
        {
          path: 'reporting',
          name: 'ProjectReporting',
          navName: '我的项目查询',
          component: ProjectReporting,
          redirect: '',
          meta: {
            showNav: true
          }
        },
        {
          path: 'total',
          name: 'Dashboard',
          navName: '统计报表',
          component: Dashboard,
          redirect: '',
          meta: {
            showNav: true
          }
        },
        // {
        //   path: 'projectEdit',
        //   navName: '编辑项目',
        //   component: ProjectEdit,
        //   meta: {
        //     showNav: false
        //   },
        // }
      ]
    },
    // {
    //   path: '/project_query',
    //   name: "ProjectQueryIndex",
    //   navName: '申报项目查询',
    //   navIcon: 'apply',
    //   component: ProjectQueryIndex,
    //   meta: {
    //     showNav: true
    //   },
    //   children: [
    //     // {
    //     //   path: 'budget',
    //     //   name: 'ProjectBudget',
    //     //   navName: '预算单位查询',
    //     //   component: ProjectBudget,
    //     //   redirect: '',
    //     //   meta: {
    //     //     showNav: true
    //     //   }
    //     // },
    //     {
    //       path: 'director',
    //       name: 'ProjectDirector',
    //       navName: '项目查询',
    //       component: ProjectDirector,
    //       redirect: '',
    //       meta: {
    //         showNav: true
    //       }
    //     },
    //     {
    //       path: 'reporting',
    //       name: 'ProjectReporting',
    //       navName: '我的项目查询',
    //       component: ProjectReporting,
    //       redirect: '',
    //       meta: {
    //         showNav: true
    //       }
    //     },
    //     // {
    //     //   path: 'expert',
    //     //   name: 'ProjectExpert',
    //     //   navName: '专家查询',
    //     //   component: ProjectExpert,
    //     //   redirect: '',
    //     //   meta: {
    //     //     showNav: true
    //     //   }
    //     // },
    //     // {
    //     //   path: 'other',
    //     //   name: 'ProjectOther',
    //     //   navName: '其他查询',
    //     //   component: ProjectOther,
    //     //   redirect: '',
    //     //   meta: {
    //     //     showNav: true
    //     //   }
    //     // },
    //   ]
    // },
    {
      path: '/project_schedule',
      name: "ProjectScheduleIndex",
      navName: '项目进度管理',
      navIcon: 'process',
      component: ProjectScheduleIndex,
      meta: {
        showNav: true
      },
      children: [
        {
          path: 'report',
          navName: '项目进度汇报',
          component: ScheduleReport,
          redirect: '',
          meta: {
            showNav: true
          },
          children: [
            {
              path: '',
              name: 'ReportList',
              navName: '项目进度汇报列表',
              component: ReportList,
              redirect: '',
              meta: {
                showNav: true
              },
            },
            {
              path: 'detail',
              name: 'ReportDetail',
              navName: '项目进度汇报详情',
              component: ReportDetail,
              redirect: '',
              meta: {
                showNav: true
              },
            },
          ]
        },
        {
          path: 'supervise',
          name: 'ScheduleSupervise',
          navName: '项目进度监管',
          component: ScheduleSupervise,
          redirect: '',
          meta: {
            showNav: true
          }
        },
      ]
    },
    {
      path: '/project_library',
      name: "ProjectLibraryIndex",
      navName: '项目库管理',
      navIcon: 'lib',
      component: ProjectLibraryIndex,
      meta: {
        showNav: true
      },
      children: [
        {
          path: 'management',
          name: 'ProjectManagement',
          navName: '项目管理',
          component: ProjectManagement,
          redirect: '',
          meta: {
            showNav: true
          }
        },
        {
          path: 'add',
          name: 'ProjectAdd',
          navName: '新建项目',
          component: ProjectAdd,
          redirect: '',
          meta: {
            showNav: true
          }
        },
        {
          path: 'query',
          name: 'ProjectQuery',
          navName: '项目库查询',
          component: ProjectQuery,
          redirect: '',
          meta: {
            showNav: true
          }
        },
      ]
    },
    {
      path: '/expert_library',
      name: "ExpertLibraryIndex",
      navName: '专家库管理',
      navIcon: 'expert',
      component: ExpertLibraryIndex,
      meta: {
        showNav: true
      },
      children: [
        {
          path: 'expert',
          name: 'ExpertManagement',
          navName: '专家管理',
          component: ExpertManagement,
          redirect: '',
          meta: {
            showNav: true
          }
        },
        {
          path: 'add',
          name: 'ExpertAdd',
          navName: '新增专家',
          component: ExpertAdd,
          redirect: '',
          meta: {
            showNav: true
          }
        },
        // {
        //   path: 'group',
        //   name: 'GroupManagement',
        //   navName: '专家组管理',
        //   component: GroupManagement,
        //   redirect: '',
        //   meta: {
        //     showNav: true
        //   }
        // },
      ]
    },
    {
      path: '/system_management',
      name: "SystemManagementIndex",
      navName: '系统管理',
      navIcon: 'system',
      component: SystemManagementIndex,
      meta: {
        showNav: true
      },
      children: [
        {
          path: 'dictionary',
          name: 'SystemDictionary',
          navName: '字典管理',
          component: SystemDictionary,
          redirect: '',
          meta: {
            showNav: true
          }
        },
        {
          path: 'menu',
          name: 'SystemMenu',
          navName: '菜单管理',
          component: SystemMenu,
          redirect: '',
          meta: {
            showNav: true
          }
        },
        {
          path: 'organization',
          name: 'SystemOrganization',
          navName: '组织管理',
          component: SystemOrganization,
          redirect: '',
          meta: {
            showNav: true
          }
        },
        {
          path: 'role',
          name: 'SystemRole',
          navName: '角色管理',
          component: SystemRole,
          redirect: '',
          meta: {
            showNav: true
          }
        },
        {
          path: 'user',
          // name: 'SystemUserIndex',
          navName: '用户管理',
          component: SystemManagementIndex,
          redirect: '',
          meta: {
            showNav: true
          },
          children: [
            {
              path: '',
              name: 'SystemUser',
              navName: '用户管理',
              component: SystemUser,
              redirect: '',
              meta: {
                showNav: true
              },
            },
            {
              path: 'detail/:id',
              name: 'SystemUserDetail',
              navName: '用户详情',
              component: SystemUserDetail,
              redirect: '',
              meta: {
                showNav: true
              },
            }
          ],
        },
        {
          path: 'jurisdiction',
          name: 'SystemJurisdiction',
          navName: '权限管理',
          component: SystemJurisdiction,
          redirect: '',
          meta: {
            showNav: true
          }
        },
      ]
    },
    {
      path: '/log_management',
      name: "LogManagementIndex",
      navName: '日志管理',
      navIcon: 'log',
      component: LogManagementIndex,
      meta: {
        showNav: true
      },
      children: [
        {
          path: 'user',
          name: 'LogUser',
          navName: '用户日志',
          component: LogUser,
          redirect: '',
          meta: {
            showNav: true
          }
        },
        {
          path: 'system',
          name: 'LogSystem',
          navName: '系统日志',
          component: LogSystem,
          redirect: '',
          meta: {
            showNav: true
          }
        },
        {
          path: 'security',
          name: 'LogSecurity',
          navName: '安全日志',
          component: LogSecurity,
          redirect: '',
          meta: {
            showNav: true
          }
        },

      ]
    },
    // {
    //   path: '/template',
    //   name: "TemplateIndex",
    //   navName: '模版',
    //   navIcon: 'fa fa-cubes',
    //   component: TemplateIndex,
    //   meta: {
    //     showNav: true
    //   },
    //   children: [
    //     {
    //       path: 'one',
    //       name: 'TemplateOne',
    //       navName: '模版一',
    //       component: TemplateOne,
    //       redirect: '',
    //       meta: {
    //         showNav: true
    //       }
    //     },
    //     {
    //       path: 'two',
    //       name: 'TemplateTwo',
    //       navName: '模版二',
    //       component: TemplateTwo,
    //       redirect: '',
    //       meta: {
    //         showNav: true
    //       }
    //     },
    //     {
    //       path: 'three',
    //       name: 'TemplateThree',
    //       navName: '模版三',
    //       component: TemplateThree,
    //       redirect: '',
    //       meta: {
    //         showNav: true
    //       }
    //     },
    //     {
    //       path: 'four',
    //       name: 'TemplateFour',
    //       navName: '模版四',
    //       component: TemplateFour,
    //       redirect: '',
    //       meta: {
    //         showNav: true
    //       }
    //     },
    //   ]
    // },

  ]
})
