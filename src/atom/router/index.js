import Vue from 'vue'
import Router from 'vue-router'
import index from '../components/index'
import bind from '../components/bind'
import pandect from '../components/pandect/pandect'
import bm from '../components/bm/bm'
import app from '../components/app/app'
import manage from '../components/manage/manage'
import notmanage from '../components/manage/notmanage'
import regular from '../components/regular/regular'
import reguform from '../components/regular/reguform'
import message from '../components/message/message'

import project from '../components/project'
import rule from '../components/rules/rule'
import optimize from '../components/rules/optimize'
import create from '../components/create/create'
import sync from '../components/create/sync'
import gener from '../components/generalize/gener'
import plan from '../components/generalize/plan'
import edit from '../components/generalize/edit'
import copy from '../components/generalize/copy'
import ad from '../components/ad/ad'
import data from '../components/data/data'
import createform from '../components/data/createform'
import daycpi from '../components/data/daycpi'
import target from '../components/target/target'


Vue.use(Router);

export default new Router({
    // mode: 'history',
    routes: [{
        path: '/',
        name: 'index',
        component: index,
        redirect: to => {
            if (localStorage.getItem('atom_bind') == 1) {
                return '/pandect';
            } else {
                return '/bind';
            }
        },
        children: [
            {
                path: 'bind',
                name: 'bind',
                component: bind,
                meta: {
                    title: '绑定facebook'
                }
            },
            {
                path: 'pandect',
                name: 'pandect',
                component: pandect,
                meta: {
                    title: '总览'
                }
            },
            {
                path: 'bm',
                name: 'bm',
                component: bm,
                meta: {
                    title: 'BM同步'
                }
            },
            {
                path: 'app',
                name: 'app',
                component: app,
                meta: {
                    title: 'APP同步'
                }
            },
            {
                path: 'manage',
                name: 'manage',
                component: manage,
                meta: {
                    title: '管理项目'
                }
            },
            {
                path: 'notmanage',
                name: 'notmanage',
                component: notmanage,
                meta: {
                    title: '已归档项目'
                }
            },
            {
                path: 'regular',
                name: 'regular',
                component: regular,
                meta: {
                    title: '规则列表'
                }
            },
            {
                path: 'reguform',
                name: 'reguform',
                component: reguform,
                meta: {
                    title: '规则报表'
                }
            },
            {
                path: 'message',
                name: 'message',
                component: message,
                meta: {
                    title: '消息中心'
                }
            }
        ]
    },
    {
        path: '/project/:id',
        name: 'project',
        component: project,
        redirect: to => {
            return '/project/:id/ad';
        },
        children: [
            {
                path: 'rule',
                name: 'rule',
                component: rule,
                meta: {
                    title: '规则引擎'
                }
            },
            {
                path: 'optimize',
                name: 'optimize',
                component: optimize,
                meta: {
                    title: '优化记录'
                }
            },
            {
                path: 'create',
                name: 'create',
                component: create,
                meta: {
                    title: '创意管理'
                }
            },
            {
                path: 'sync',
                name: 'sync',
                component: sync,
                meta: {
                    title: '同步记录'
                }
            },
            {
                path: 'gener/:fid',
                name: 'gener',
                component: gener,
                meta: {
                    title: '创建推广计划'
                }
            },
            {
                path: 'gener/:fid/:tid',
                name: 'gener',
                component: gener,
                meta: {
                    title: '创建推广计划'
                }
            },
            {
                path: 'plan/:planid?',
                name: 'plan',
                component: plan,
                meta: {
                    title: '推广计划管理'
                }
            },
            {
                path: 'edit/:pid',
                name: 'edit',
                component: edit,
                meta: {
                    title: '编辑推广计划'
                }
            },
            {
                path: 'copy/:pid',
                name: 'copy',
                component: copy,
                meta: {
                    title: '复制推广计划'
                }
            },
            {
                path: 'ad/:bid?',
                name: 'ad',
                component: ad,
                meta: {
                    title: '广告管理'
                }
            },
            {
                path: 'data',
                name: 'data',
                component: data,
                meta: {
                    title: '账户报表'
                }
            },
            {
                path: 'createform',
                name: 'createform',
                component: createform,
                meta: {
                    title: '创意报表'
                }
            },
            {
                path: 'daycpi',
                name: 'daycpi',
                component: daycpi,
                meta: {
                    title: '每日CPI'
                }
            },
            {
                path: 'target',
                name: 'target',
                component: target,
                meta: {
                    title: '受众管理'
                }
            },
        ]
    }
    ]
})