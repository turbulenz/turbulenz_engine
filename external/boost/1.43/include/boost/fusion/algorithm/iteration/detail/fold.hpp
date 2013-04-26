/*=============================================================================
    Copyright (c) 2001-2006 Joel de Guzman
    Copyright (c) 2006 Dan Marsden

    Distributed under the Boost Software License, Version 1.0. (See accompanying
    file LICENSE_1_0.txt or copy at http://www.boost.org/LICENSE_1_0.txt)
==============================================================================*/
#if !defined(BOOST_FUSION_FOLD_HPP_20070528_1253)
#define BOOST_FUSION_FOLD_HPP_20070528_1253

#include <boost/mpl/bool.hpp>
#include <boost/mpl/apply.hpp>
#include <boost/mpl/identity.hpp>
#include <boost/fusion/iterator/equal_to.hpp>
#include <boost/fusion/sequence/intrinsic/begin.hpp>
#include <boost/fusion/sequence/intrinsic/end.hpp>
#include <boost/fusion/iterator/deref.hpp>
#include <boost/fusion/iterator/value_of.hpp>
#include <boost/fusion/iterator/next.hpp>
#include <boost/fusion/iterator/distance.hpp>
#include <boost/utility/result_of.hpp>

#include <boost/type_traits/add_const.hpp>
#include <boost/type_traits/add_reference.hpp>

namespace boost { namespace fusion {
namespace result_of
{
    template <typename Sequence, typename State, typename F>
    struct fold;
}
namespace detail
{
    template <typename F>
    struct apply_fold_result
    {
        template <typename State, typename Value>
        struct apply
            : boost::result_of<F(State, Value)>
        {};
    };

    template <typename State, typename Iterator, typename F>
    struct fold_apply
    {
        typedef typename result_of::deref<Iterator>::type dereferenced;
        typedef typename add_reference<typename add_const<State>::type>::type lvalue_state;
        typedef typename boost::result_of<F(lvalue_state, dereferenced)>::type type;
    };

    template <typename First, typename Last, typename State, typename F>
    struct static_fold;

    template <typename First, typename Last, typename State, typename F>
    struct next_result_of_fold
    {
        typedef typename
        static_fold<
              typename result_of::next<First>::type
            , Last
            , typename fold_apply<State, First, F>::type
            , F
            >::type
        type;
    };

    template <typename First, typename Last, typename State, typename F>
    struct static_fold
    {
        typedef typename
        mpl::if_<
            result_of::equal_to<First, Last>
            , mpl::identity<State>
            , next_result_of_fold<First, Last, State, F>
        >::type
        result;

        typedef typename result::type type;
    };

    template<typename State, typename I0, typename F, int N>
    struct result_of_unrolled_fold;

    template<int N>
    struct unrolled_fold
    {
        template<typename State, typename I0, typename F>
        static typename result_of_unrolled_fold<State, I0, F, N>::type
        call(State const& state, I0 const& i0, F f)
        {
            typedef typename result_of::next<I0>::type I1;
            I1 i1 = fusion::next(i0);
            typedef typename result_of::next<I1>::type I2;
            I2 i2 = fusion::next(i1);
            typedef typename result_of::next<I2>::type I3;
            I3 i3 = fusion::next(i2);
            typedef typename result_of::next<I3>::type I4;
            I4 i4 = fusion::next(i3);

            return unrolled_fold<N-4>::call(f(f(f(f(state, *i0), *i1), *i2), *i3), i4, f);
        }
    };

    template<>
    struct unrolled_fold<3>
    {
        template<typename State, typename I0, typename F>
        static typename result_of_unrolled_fold<State, I0, F, 3>::type
        call(State const& state, I0 const& i0, F f)
        {
            typedef typename result_of::next<I0>::type I1;
            I1 i1 = fusion::next(i0);
            typedef typename result_of::next<I1>::type I2;
            I2 i2 = fusion::next(i1);
            return f(f(f(state, *i0), *i1), *i2);
        }
    };

    template<>
    struct unrolled_fold<2>
    {
        template<typename State, typename I0, typename F>
        static typename result_of_unrolled_fold<State, I0, F, 2>::type
        call(State const& state, I0 const& i0, F f)
        {
            typedef typename result_of::next<I0>::type I1;
            I1 i1 = fusion::next(i0);
            return f(f(state, *i0), *i1);
        }
    };

    template<>
    struct unrolled_fold<1>
    {
        template<typename State, typename I0, typename F>
        static typename result_of_unrolled_fold<State, I0, F, 1>::type
        call(State const& state, I0 const& i0, F f)
        {
            return f(state, *i0);
        }
    };

    template<>
    struct unrolled_fold<0>
    {
        template<typename State, typename I0, typename F>
        static State call(State const& state, I0 const&, F)
        {
            return state;
        }
    };

    // terminal case
    template <typename First, typename Last, typename State, typename F>
    inline State const&
    linear_fold(First const&, Last const&, State const& state, F, mpl::true_)
    {
        return state;
    }

    // non-terminal case
    template <typename First, typename Last, typename State, typename F>
    inline typename static_fold<First, Last, State, F>::type
    linear_fold(
        First const& first
      , Last const& last
      , State const& state
      , F f
      , mpl::false_)
    {
        return detail::linear_fold(
            fusion::next(first)
          , last
          , f(state, *first)
          , f
          , result_of::equal_to<typename result_of::next<First>::type, Last>()
        );
    }

    template<typename State, typename I0, typename F, int N>
    struct result_of_unrolled_fold
    {
        typedef typename result_of::next<I0>::type I1;
        typedef typename result_of::next<I1>::type I2;
        typedef typename result_of::next<I2>::type I3;
        typedef typename result_of::next<I3>::type I4;
        typedef typename fold_apply<State, I0, F>::type Rest1;
        typedef typename fold_apply<Rest1, I1, F>::type Rest2;
        typedef typename fold_apply<Rest2, I2, F>::type Rest3;
        typedef typename fold_apply<Rest3, I3, F>::type Rest4;

        typedef typename result_of_unrolled_fold<Rest4, I4, F, N-4>::type type;
    };

    template<typename State, typename I0, typename F>
    struct result_of_unrolled_fold<State, I0, F, 3>
    {
        typedef typename result_of::next<I0>::type I1;
        typedef typename result_of::next<I1>::type I2;
        typedef typename fold_apply<State, I0, F>::type Rest;
        typedef typename fold_apply<Rest, I1, F>::type Rest2;
        typedef typename fold_apply<Rest2, I2, F>::type type;
    };

    template<typename State, typename I0, typename F>
    struct result_of_unrolled_fold<State, I0, F, 2>
    {
        typedef typename result_of::next<I0>::type I1;
        typedef typename fold_apply<State, I0, F>::type Rest;
        typedef typename fold_apply<Rest, I1, F>::type type;
    };

    template<typename State, typename I0, typename F>
    struct result_of_unrolled_fold<State, I0, F, 1>
    {
        typedef typename fold_apply<State, I0, F>::type type;
    };

    template<typename State, typename I0, typename F>
    struct result_of_unrolled_fold<State, I0, F, 0>
    {
        typedef State type;
    };

    template<typename Sequence, typename State, typename F, bool>
    struct choose_fold;

    template<typename Sequence, typename State, typename F>
    struct choose_fold<Sequence, State, F, true>
    {
        typedef typename result_of::begin<Sequence>::type begin;
        typedef typename result_of::end<Sequence>::type end;
        typedef typename result_of_unrolled_fold<
            State, begin, F, result_of::distance<begin, end>::type::value>::type type;
    };

    template<typename Sequence, typename State, typename F>
    struct choose_fold<Sequence, State, F, false>
    {
        typedef typename
        detail::static_fold<
            typename result_of::begin<Sequence>::type
            , typename result_of::end<Sequence>::type
            , State
            , F
            >::type
        type;
    };

    template<typename Sequence, typename State, typename F, typename Tag>
    typename result_of::fold<Sequence, State, F>::type
    fold(Sequence& seq, State const& state, F f, Tag)
    {
        return linear_fold(
            fusion::begin(seq)
          , fusion::end(seq)
          , state
          , f
          , result_of::equal_to<
                typename result_of::begin<Sequence>::type
              , typename result_of::end<Sequence>::type>()
        );
    }

    template<typename Sequence, typename State, typename F>
    typename result_of::fold<Sequence, State, F>::type
    fold(Sequence& seq, State const& state, F f, random_access_traversal_tag)
    {
        typedef typename result_of::begin<Sequence>::type begin;
        typedef typename result_of::end<Sequence>::type end;
        return unrolled_fold<result_of::distance<begin, end>::type::value>::call(
              state
            , fusion::begin(seq)
            , f);
    }
}}}

#endif
